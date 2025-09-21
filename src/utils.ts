import CryptoJS from 'crypto-js';

export function hmac(key: string, string: string, encoding: 'hex' | 'base64' = 'hex'): string {
    const hmac = CryptoJS.HmacSHA256(string, key);
    return hmac.toString(encoding === 'hex' ? CryptoJS.enc.Hex : CryptoJS.enc.Base64);
}

export function hash(string: string, encoding: 'hex' | 'base64' = 'hex'): string {
    const hash = CryptoJS.SHA256(string);
    return hash.toString(encoding === 'hex' ? CryptoJS.enc.Hex : CryptoJS.enc.Base64);
}

// RFC 3986 compliant URL encoding
export function encodeRfc3986(urlEncodedString: string): string {
    return urlEncodedString.replace(/[!'()*]/g, function (c: string) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}

export function encodeRfc3986Full(str: string): string {
    if (typeof str !== 'string') {
        throw new Error('Input must be a string');
    }
    
    // Properly encode the string according to RFC 3986
    return encodeRfc3986(encodeURIComponent(str));
}