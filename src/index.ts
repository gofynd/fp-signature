import type { RequestParam, SigningOptions } from "./types";
import RequestSigner from "./RequestSigner";

export function sign(request : RequestParam, options?: SigningOptions) {
    options = {
        forQuery: false,
        secret: '1234567',
        ...options
    }
    if(options.forQuery){
        return new RequestSigner(request, options.secret).signQuery();
    }
    else{
        return new RequestSigner(request, options.secret).sign();
    }
}