import RequestSigner, { RequestParam } from './RequestSigner';

export function sign(request : RequestParam, kCredentials: any) {
    return new RequestSigner(request, kCredentials).sign();
}