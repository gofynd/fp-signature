import RequestSigner, { RequestParam } from './RequestSigner';

export function sign(request : RequestParam, kCredentials: string) {
    return new RequestSigner(request, kCredentials).sign();
}