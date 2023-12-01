const version = '1.0.0';

const FP_SIGNATURE_PACKAGE = "fp_signature_package";
const FP_SIGNATURE_VERSION = "fp_signature_version";

const fp_signature_saved_package = pm.collectionVariables.get(FP_SIGNATURE_PACKAGE);
const fp_signature_saved_version = pm.collectionVariables.get(FP_SIGNATURE_VERSION);

if(fp_signature_saved_package && fp_signature_saved_version === version){
    addSignature();
}
else{
    pm.collectionVariables.unset(FP_SIGNATURE_PACKAGE);
    pm.collectionVariables.unset(FP_SIGNATURE_VERSION);

    pm.sendRequest(`https://cdn.jsdelivr.net/npm/@gofynd/fp-signature@${version}`, (err, res) => {
        if (err || !res || res.code !== 200) {
            throw Error("Failed to fetch FP-Signature package.")
        }

        pm.collectionVariables.set(FP_SIGNATURE_PACKAGE, res.text());
        pm.collectionVariables.set(FP_SIGNATURE_VERSION, version);

        addSignature();
    });
}

function addSignature(){
    eval(pm.collectionVariables.get(FP_SIGNATURE_PACKAGE));

    let signingOptions = {
        method: pm.request.method.toUpperCase(),
        host: pm.request.url.getHost(),
        path: pm.request.url.getPathWithQuery(),
        body: pm.request.body ? pm.request.body.toString() : null,
        headers: pm.request.headers
    }

    let signature = FPSignature.sign(signingOptions);

    if (!(signature && signature["x-fp-date"] && signature["x-fp-signature"])) {
        throw Error("Error generating signature")
    }

    pm.request.headers.add({
      key: "x-fp-date",
      value: signature["x-fp-date"]
    });

    pm.request.headers.add({
      key: "x-fp-signature",
      value: signature["x-fp-signature"]
    });
}