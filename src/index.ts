import type { RequestParam, Signature, SigningOptions } from "./types";
import RequestSigner from "./RequestSigner";

export function sign(request : RequestParam, options?: SigningOptions) : Signature{
    options = {
        signQuery: false,
        secret: '1234567',
        ...options
    }
    if(options.signQuery){
        return new RequestSigner(request, options.secret).signQuery();
    }
    else{
        return new RequestSigner(request, options.secret).sign();
    }
}