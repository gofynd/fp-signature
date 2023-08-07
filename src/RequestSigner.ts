import querystring from "querystring";

type Dictionary = Record<string, any>
import { HEADERS_TO_IGNORE, HEADERS_TO_INCLUDE } from "./constants"
import { hmac, hash, encodeRfc3986, encodeRfc3986Full } from "./utils";

export type RequestParam = {
  headers?: any;
  method: string;
  host?: string;
  hostname?: string;
  port?: number;
  path?: string;
  body?: any;
  signQuery?: boolean
  doNotEncodePath?: boolean;
  doNotModifyHeaders?: boolean; 
};

type ParsedPath = {
  path: string;
  query: querystring.ParsedUrlQuery;
}

export default class RequestSigner {
  
  secret: string;
  request: RequestParam;
  parsedPath: ParsedPath;
  datetime: string;

  constructor(request: RequestParam, secret: string) {

    if(!secret){
      throw new Error("Signature secrete cannot be null, pass secret parameter in constructor.");
    }

    this.secret = secret;

    let headers = (request.headers = request.headers || {});
    this.request = request;

    if (!request.method && request.body) {
      request.method = "POST";
    }

    if (!headers.Host && !headers.host) {
      headers.Host = request.hostname || request.host;

      // If a port is specified explicitly, use it as is
      if (request.port) {
        headers.Host += ":" + request.port;
      }
    }
    if (!request.hostname && !request.host) {
      request.hostname = headers.Host || headers.host;
    }
  }

  prepareRequest() {
    this.parsePath();

    let request = this.request;
    let headers = request.headers;
    let query;

    if (request.signQuery) {
      this.parsedPath.query = query = this.parsedPath.query || {};

      if (query["x-fp-date"]) {
        this.datetime = query["x-fp-date"] as string;
      } else {
        query["x-fp-date"] = this.getDateTime();
      }
    } else {
      if (!request.doNotModifyHeaders) {
        if (headers["x-fp-date"]) {
          this.datetime = headers["x-fp-date"] || headers["x-fp-date"];
        } else {
          headers["x-fp-date"] = this.getDateTime();
        }
      }

      delete headers["x-fp-signature"];
      delete headers["X-Fp-Signature"];
    }
  }

  sign() {
    if (!this.parsedPath) {
      this.prepareRequest();
    }
    if (this.request.signQuery) {
      this.parsedPath.query["x-fp-signature"] = this.signature();
    } else {
      this.request.headers["x-fp-signature"] = this.signature();
    }
    this.request.path = this.formatPath();
    return this.request;
  }

  getDateTime() {
    if (!this.datetime) {
      let headers = this.request.headers;
      let date = new Date(headers.Date || headers.date || new Date());

      this.datetime = date.toISOString().replace(/[:\-]|\.\d{3}/g, "");
    }
    return this.datetime;
  }

  getDate() {
    return this.getDateTime().substr(0, 8);
  }

  signature() {
    let strTosign = this.stringToSign();
    return `v1.1:${hmac(this.secret, strTosign, "hex")}`;
  }

  stringToSign() {
    return [this.getDateTime(), hash(this.canonicalString(), "hex")].join("\n");
  }

  canonicalString() {
    if (!this.parsedPath) {
      this.prepareRequest();
    }

    let pathStr = this.parsedPath.path;
    let query = this.parsedPath.query;
    let headers = this.request.headers;
    let queryStr = "";
    let normalizePath = true;
    let decodePath = this.request.doNotEncodePath;
    let decodeSlashesInPath = false;
    let firstValOnly = false;
    let bodyHash = hash(this.request.body || "", "hex");
    if (query) {
      let reducedQuery = Object.keys(query).reduce<Dictionary>(function (obj, key) {
        if (!key) {
          return obj;
        }
        obj[encodeRfc3986Full(key)] = !Array.isArray(query[key])
          ? query[key]
          : firstValOnly
          ? query[key]?.[0]
          : query[key];
        return obj;
      }, {});
      let encodedQueryPieces : string[] = [];
      Object.keys(reducedQuery)
        .sort()
        .forEach(function (key) {
          if (!Array.isArray(reducedQuery[key])) {
            encodedQueryPieces.push(
              key + "=" + encodeRfc3986Full(reducedQuery[key])
            );
          } else {
            reducedQuery[key]
              .map(encodeRfc3986Full)
              .sort()
              .forEach(function (val: any) {
                encodedQueryPieces.push(key + "=" + val);
              });
          }
        });
      queryStr = encodedQueryPieces.join("&");
    }
    if (pathStr !== "/") {
      if (normalizePath) {
        pathStr = pathStr.replace(/\/{2,}/g, "/");
      }
      pathStr = pathStr
        .split("/")
        .reduce(function (path: string[], piece) {
          if (normalizePath && piece === "..") {
            path.pop();
          } else if (!normalizePath || piece !== ".") {
            if (decodePath)
              piece = decodeURIComponent(piece.replace(/\+/g, " "));
            path.push(encodeRfc3986Full(piece));
          }
          return path;
        }, [])
        .join("/");
      if (pathStr[0] !== "/") pathStr = "/" + pathStr;
      if (decodeSlashesInPath) pathStr = pathStr.replace(/%2F/g, "/");
    }

    let canonicalReq = [
      this.request.method || "GET",
      pathStr,
      queryStr,
      this.canonicalHeaders() + "\n",
      this.signedHeaders(),
      bodyHash,
    ].join("\n");
    return canonicalReq;
  }

  canonicalHeaders() {
    let headers = this.request.headers;

    function trimAll(header: any) {
      return header.toString().trim().replace(/\s+/g, " ");
    }
    return Object.keys(headers)
      .filter(function (key) {
        let notInIgnoreHeader = HEADERS_TO_IGNORE[key.toLowerCase()] == null;
        if (notInIgnoreHeader) {
          let foundMatch = false;
          for (let t in HEADERS_TO_INCLUDE) {
            foundMatch =
              foundMatch || new RegExp(HEADERS_TO_INCLUDE[t], "ig").test(key);
          }
          return foundMatch;
        } else {
          return false;
        }
      })
      .sort(function (a, b) {
        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
      })
      .map(function (key) {
        return key.toLowerCase() + ":" + trimAll(headers[key]);
      })
      .join("\n");
  }

  signedHeaders() {
    return Object.keys(this.request.headers)
      .map(function (key) {
        return key.toLowerCase();
      })
      .filter(function (key) {
        let notInIgnoreHeader = HEADERS_TO_IGNORE[key.toLowerCase()] == null;
        if (notInIgnoreHeader) {
          let foundMatch = false;
          for (let t in HEADERS_TO_INCLUDE) {
            foundMatch =
              foundMatch || new RegExp(HEADERS_TO_INCLUDE[t], "ig").test(key);
          }
          return foundMatch;
        } else {
          return false;
        }
      })
      .sort()
      .join(";");
  }

  parsePath() {
    let path: string = this.request.path || "/";
    let queryIx: number = path.indexOf("?");
    let query : querystring.ParsedUrlQuery = {};

    if (queryIx >= 0) {
      query = querystring.parse(path.slice(queryIx + 1));
      path = path.slice(0, queryIx);
    }
    path = path
      .split("/")
      .map((t) => {
        return encodeURIComponent(decodeURIComponent(t));
      })
      .join("/");

    this.parsedPath = {
      path: path,
      query: query,
    };
  }

  formatPath() {
    let path = this.parsedPath.path;
    let query = this.parsedPath.query;

    if (!query) {
      return path;
    }

    // Services don't support empty query string keys
    if (query[""] != null) {
      delete query[""];
    }

    return path + "?" + encodeRfc3986(querystring.stringify(query));
  }
}