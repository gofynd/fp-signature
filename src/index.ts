import type { RequestParam, Signature, SigningOptions } from "./types";
import RequestSigner from "./RequestSigner";

export function sign(request : RequestParam, options?: SigningOptions) : Signature{
    if (!options?.secret || (typeof options.secret === 'string' && options.secret.length === 0)) {
        throw new Error("Secret is required for signing. Please provide a secret in the options parameter.");
    }
    if (typeof options.secret !== 'string') {
        throw new Error("Secret must be a non-empty string");
    }
    
    return new RequestSigner(request, options.secret).sign();
}