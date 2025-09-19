# FP-Signature

Fynd platform's signature logic



FP-Signature is a versatile npm package that provides signature logic for Fynd platform requests. This package supports both CommonJS and ES modules, and it also comes with a web bundle for direct usage in browsers.

## Installation

You can install FP-Signature via npm:

```bash
npm install @gofynd/fp-signature
```

## How to Use

### For CommonJS

```javascript
const { sign } = require("@gofynd/fp-signature");
```

### For ES Modules

```javascript
import { sign } from "@gofynd/fp-signature";
```

### For Browser

```html
<script src="https://cdn.jsdelivr.net/npm/@gofynd/fp-signature@{version}"></script>
<script>
    // FP-Signature library will be attached to the global window object
    FPSignature.sign();
</script>
```

### In Postman Prescript

To use FP-Signature in Postman as a pre-script, include the [postman_prescript.js](examples/postman_prescript.js) file in the pre-script section of your Postman collection. 

Change the FP-Signature package version within the pre-script according to your requirements.


## Functionality

### `sign` function

The `sign` function is used to generate a signature. It takes two parameters: `request` and `options`.

It will return the signature string directly.

The `x-fp-date` is automatically generated and used internally for signature generation. Include the returned signature string in the `x-fp-signature` header to sign the request.

```typescript
type RequestParam = {
  method: string;
  host?: string;
  port?: number;
  path?: string;
  headers?: any;
  body?: any;
  doNotEncodePath?: boolean;
  doNotModifyHeaders?: boolean; 
};

type SigningOptions = {
    secret?: string;
}

function sign(request : RequestParam, options: SigningOptions) : string {}
```

### `RequestParam` Object

The `RequestParam` object is used to configure the details of the HTTP request that needs to be signed.

#### Properties:

- **`method`**: *(string, required)* - HTTP method for the request (e.g., "GET", "POST").
  
- **`host`**: *(string, optional)* - The host of the server. Ex: `developer.mozilla.org:4097`, `api.fyndx5.de`

- **`port`**: *(number, optional)* - The port number of the server.

- **`path`**: *(string, optional)* - The path of the request URL with query parameters(if any).

- **`headers`**: *(object, optional)* - Custom headers for the request. Exclude default headers like common, delete, get, head, post, put, patch.

- **`body`**: *(any, optional)* - The body of the request.

- **`doNotEncodePath`**: *(boolean, optional)* - If true, the path will not be URL encoded.

- **`doNotModifyHeaders`**: *(boolean, optional)* - If true, headers will not be modified during signing.

#### Example:

```javascript
const requestToSign = {
    method: "GET",
    host: "api.fynd.com",
    path: "/service/application/configuration/v1.0/application?queryParam=value",
    headers: {
      Authorization: "Bearer <authorizationToken>",
      "x-currency-code": "INR"
    },
};
```


### Signature Placement

The placement of the signature (`x-fp-signature`) in the request is determined by the `options.signQuery` property:

- If `options.signQuery` is `true`, the `x-fp-signature` will be generated to use in query parameter.
- If `options.signQuery` is `false`, the `x-fp-signature` will be generated to use in headers.


## Example

### Signature to add in header

```javascript
// For Common JS
// const {sign} = require("@gofynd/fp-signature")

// For ES Module
import {sign} from "@gofynd/fp-signature";

const requestToSign = {
  method: "GET",
  host: "api.fynd.com",
  path: "/service/application/configuration/v1.0/application",
  headers: {
    Authorization: "Bearer <authorizationToken>",
    "x-currency-code": "INR"
  },
};

const signature = sign(requestToSign, { secret: 'your-secret-key' });

const res = axios.get("http://api.fynd.com/service/application/configuration/v1.0/application", {
  headers: {
    Authorization: "Bearer <authorizationToken>",
    "x-currency-code": "INR",
    "x-fp-signature": signature
  }
});

```

### Signature to add in query

```javascript
// For Common JS
// const {sign} = require("@gofynd/fp-signature")

// For ES Module
import {sign} from "@gofynd/fp-signature";

const requestToSign = {
  method: "GET",
  host: "api.fynd.com",
  path: "/service/application/configuration/v1.0/application",
  headers: {
    Authorization: "Bearer <authorizationToken>",
    "x-currency-code": "INR"
  },
};

const signature = sign(requestToSign, {
  secret: 'your-secret-key'
});

const res = axios.get("http://api.fynd.com/service/application/configuration/v1.0/application", {
  params: {
    "x-fp-signature": signature
  },
  headers: {
    Authorization: "Bearer <authorizationToken>",
    "x-currency-code": "INR"
  }
});

```