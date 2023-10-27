import { sign } from "../src";
const combineURLs = require("axios/lib/helpers/combineURLs");
const isAbsoluteURL = require("axios/lib/helpers/isAbsoluteURL");
const querystring = require("query-string");

/**
 * Example: When using as interceptor in axios
 * @param {import("axios").AxiosRequestConfig} config 
 */
function signatureExample(config) {
    if (!config.url) {
        throw new Error(
            "No URL present in request config, unable to sign request"
        );
    }

    let url = config.url;
    if (config.baseURL && !isAbsoluteURL(config.url)) {
        url = combineURLs(config.baseURL, config.url);
    }

    const { host, pathname, search } = new URL(url);
    const { data, headers, method, params } = config;

    let querySearchObj = querystring.parse(search);
    querySearchObj = { ...querySearchObj, ...params };
    let queryParam = "";
    if (querySearchObj && Object.keys(querySearchObj).length) {
        if (querystring.stringify(querySearchObj).trim() !== "") {
            queryParam = `?${querystring.stringify(querySearchObj)}`;
        }
    }

    let transformedData;
    if (method != "get") {
        let { transformRequest } = config;
        if (transformRequest) {
            if (transformRequest.length) {
              transformRequest = transformRequest[0];
            }
            transformedData = transformRequest(data, headers);
        }
        else {
            throw new Error(
                "Could not get default transformRequest function from Axios defaults"
              );
        }
    }

    // Remove all the default Axios headers
    const {
        common,
        delete: _delete, // 'delete' is a reserved word
        get,
        head,
        post,
        put,
        patch,
        ...headersToSign
    } = headers;

    const signingOptions = {
        method: method && method.toUpperCase(),
        host: host,
        path: pathname + search + queryParam,
        body: transformedData,
        headers: headersToSign,
    };

    const result = sign(signingOptions);

    console.log(result["x-fp-date"]);
    console.log(result["x-fp-signature"]);

    config.headers["x-fp-date"] = result["x-fp-date"];
    config.headers["x-fp-signature"] = result["x-fp-signature"];

    return config;
}

signatureExample();
