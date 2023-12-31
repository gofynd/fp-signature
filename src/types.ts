import type querystring from "querystring";

export type RequestParam = {
    method: string;
    host?: string;    
    port?: number;
    path?: string;
    headers?: any;
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
    signQuery?: boolean;
}

export type Signature = {
    "x-fp-signature": string;
    "x-fp-date": string;
}