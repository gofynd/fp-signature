import querystring from "querystring";

import type { RequestParam, ParsedPath, Dictionary, Signature } from "./types";
import { hmac, hash, encodeRfc3986, encodeRfc3986Full } from "./utils";

type RequestParamInternal = RequestParam;

export default class RequestSigner { 

  secret: string;
  request: RequestParamInternal;
  parsedPath: ParsedPath;
  datetime: string;

  constructor(request: RequestParam, secret?: string) {
    // Input validation
    if(!secret){
      throw new Error("Signature secret cannot be null, pass secret parameter in constructor.");
    }
    if(typeof secret !== 'string' || secret.length === 0) {
      throw new Error("Secret must be a non-empty string");
    }
    if(!request || typeof request !== 'object') {
      throw new Error("Request must be a valid object");
    }
    if(!request.method || typeof request.method !== 'string') {
      throw new Error("Request method is required and must be a string");
    }

    this.secret = secret;
    this.request = request;

    let headers = (this.request.headers = this.request.headers || {});

    // Validate and sanitize headers
    this.validateHeaders(headers);

    if (!this.request.method && this.request.body) {
      this.request.method = "POST";
    }

    if (!headers.Host && !headers.host) {
      headers.Host = this.request.host;

      // If a port is specified explicitly, use it as is
      if (this.request.port) {
        headers.Host += ":" + this.request.port;
      }
    }
    if (!this.request.host) {
      this.request.host = headers.Host || headers.host;
    }
  }

  private validateHeaders(headers: any): void {
    if (!headers || typeof headers !== 'object') {
      return;
    }

    for (const [key, value] of Object.entries(headers)) {
      // Validate header name
      if (typeof key !== 'string' || key.length === 0) {
        throw new Error(`Invalid header name: ${key}`);
      }
      
      // Check for potentially dangerous header names
      if (key.toLowerCase().includes('\r') || key.toLowerCase().includes('\n')) {
        throw new Error(`Header name contains invalid characters: ${key}`);
      }
      
      // Validate header value
      if (value !== null && value !== undefined) {
        if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean' && typeof value !== 'object') {
          throw new Error(`Header value must be string, number, boolean, or object: ${key}`);
        }
        
        // Convert to string and check for dangerous characters
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        if (stringValue.includes('\r') || stringValue.includes('\n')) {
          throw new Error(`Header value contains invalid characters: ${key}`);
        }
      }
    }
  }

  private prepareRequest() {
    this.parsePath();

    let request = this.request;
    let headers = request.headers;

    // Check for x-fp-date in headers first, then in query parameters, or generate one
    if (headers["x-fp-date"]) {
      this.datetime = headers["x-fp-date"];
    } else if (this.parsedPath.query["x-fp-date"]) {
      this.datetime = this.parsedPath.query["x-fp-date"] as string;
    } else {
      // Generate timestamp automatically if not provided
      this.datetime = this.generateDateTime();
    }

    if (!request.doNotModifyHeaders) {
      delete headers["x-fp-signature"];
      delete headers["X-Fp-Signature"];
    }
  }

  sign() : Signature{
    if (!this.parsedPath) {
      this.prepareRequest();
    }
    this.request.headers["x-fp-signature"] = this.signature();
    return {
      'x-fp-signature': this.request.headers['x-fp-signature']
    }
  }

  private getDateTime() {
    return this.datetime;
  }

  private generateDateTime() {
    const date = new Date();
    return date.toISOString().replace(/[:\-]|\.\d{3}/g, "");
  }

  private signature() {
    let strTosign = this.stringToSign();
    return `v1.1:${hmac(this.secret, strTosign, "hex")}`;
  }

  private stringToSign() {
    return [this.getDateTime(), hash(this.canonicalString(), "hex")].join("\n");
  }

  private canonicalString() {
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
    if (query && Object.keys(query).length > 0) {
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

  private canonicalHeaders() {
    let headers = this.request.headers;

    function trimAll(header: any) {
      return header.toString().trim().replace(/\s+/g, " ");
    }
    
    // Use ALL headers provided by the client - no filtering!
    return Object.keys(headers)
      .sort(function (a, b) {
        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
      })
      .map(function (key) {
        return key.toLowerCase() + ":" + trimAll(headers[key]);
      })
      .join("\n");
  }

  private signedHeaders() {
    // Use ALL headers provided by the client - no filtering!
    return Object.keys(this.request.headers)
      .map(function (key) {
        return key.toLowerCase();
      })
      .sort()
      .join(";");
  }

  private parsePath() {
    let path: string = this.request.path || "/";
    let queryIx: number = path.indexOf("?");
    let query : querystring.ParsedUrlQuery = {};

    if (queryIx >= 0) {
      query = querystring.parse(path.slice(queryIx + 1));
      delete query["x-fp-signature"]
      delete query["X-Fp-Signature"]
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

}