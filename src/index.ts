import type { RequestParam, Signature, SigningOptions } from "./types";
import RequestSigner from "./RequestSigner";

export function sign(request : RequestParam, options?: SigningOptions) : Signature{
    options = {
        signQuery: false,
        secret: '1234567',
        headers: [],
        ...options
    }
    if(options.signQuery){
        return new RequestSigner(request, options.secret, options.headers).signQuery();
    }
    else{
        return new RequestSigner(request, options.secret, options.headers).sign();
    }
}