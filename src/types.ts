import type querystring from "querystring";

export type RequestParam = {
    headers?: any;
    method: string;
    host?: string;
    hostname?: string;
    port?: number;
    path?: string;
    body?: any;
    doNotEncodePath?: boolean;
    doNotModifyHeaders?: boolean; 
};

export type ParsedPath = {
    path: string;
    query: querystring.ParsedUrlQuery;
}

export type Dictionary = Record<string, any>

export type SigningOptions = {
    secret?: string;
    forQuery?: boolean;
}