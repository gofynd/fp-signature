import sha256 from "crypto-js/sha256";
import hmacSHA256 from "crypto-js/hmac-sha256";

export function hmac(key: string, string: string, encoding: any) : string {
    return hmacSHA256(string, key).toString();
}

export function hash(string: string, encoding: any): string {
    return sha256(string).toString();
}

// This function assumes the string has already been percent encoded
export function encodeRfc3986(urlEncodedString: string) : string {
    return urlEncodedString.replace(/[!'()*]/g, function (c: string) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}

export function encodeRfc3986Full(str: string) : string{
    return str;
    // return encodeRfc3986(encodeURIComponent(str));
}