import RequestSigner, { RequestParam } from './RequestSigner';

export function sign(request : RequestParam, secret : string) {
    return new RequestSigner(request, secret).sign();
}