const version = 'latest';

const FP_SIGNATURE_PACKAGE = "fp_signature_package";
const FP_SIGNATURE_VERSION = "fp_signature_version";

// Postman-specific header filtering constants
// Only include headers that match these patterns
const POSTMAN_HEADERS_TO_INCLUDE = ["x-fp-.*", "x-currency-code", "x-location-detail", "host"];

// Function to filter headers for Postman
function filterHeadersForPostman(allHeaders) {
  const filteredHeaders = {};
  
  for (const [key, value] of Object.entries(allHeaders)) {
    // Check if header matches include patterns
    let shouldInclude = false;
    for (const pattern of POSTMAN_HEADERS_TO_INCLUDE) {
      if (new RegExp(pattern, "i").test(key)) {
        shouldInclude = true;
        break;
      }
    }
    
    if (shouldInclude) {
      filteredHeaders[key] = value;
    }
  }
  
  return filteredHeaders;
}

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

    // Filter headers using Postman-specific rules
    const allHeaders = pm.request.headers.toObject();
    const filteredHeaders = filterHeadersForPostman(allHeaders);
    
    // Add x-fp-date header to filtered headers for signature generation
    const fpDate = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
    filteredHeaders["x-fp-date"] = fpDate;
    
    // Note: Make sure to set FP_SIGNATURE_SECRET in your Postman environment

    let signingOptions = {
        method: pm.request.method.toUpperCase(),
        host: pm.request.url.getHost(),
        path: pm.request.url.getPathWithQuery(),
        body: pm.request.body ? pm.request.body.toString() : null,
        headers: filteredHeaders
    }

    let signature = FPSignature.sign(signingOptions, { secret: pm.environment.get("FP_SIGNATURE_SECRET") });

    if (!signature) {
        throw Error("Error generating signature")
    }

    pm.request.headers.add({
      key: "x-fp-date",
      value: fpDate
    });

    pm.request.headers.add({
      key: "x-fp-signature",
      value: signature
    });
}