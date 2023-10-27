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
<script src="https://cdn.jsdelivr.net/npm/@gofynd/fp-signature"></script>
<script>
    // FP-Signature library will be attached to the global window object
    FPSignature.sign();
</script>
```

## Functionality

### `sign` function

The `sign` function is used to generate a signature. It takes two parameters: `request` and `options` and returns `x-fp-date` and `x-fp-signature`.


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
    forQuery?: boolean;
}

function sign(request : RequestParam, options: SigningOptions) {}
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
    path: "/service/application/configuration/v1.0/application",
    headers: {
      Authorization: "Bearer <Auth token>",
      "x-location-detail": {
        "pincode":"385001",
        "country":"India",
        "city":"Ahmedabad",
        "location":{
          "longitude":"72.585022",
          "latitude":"23.033863"
        }
      },
      "x-currency-code": "INR"
    },
};
```


### Signature Placement

The placement of the signature (`x-fp-signature`) in the request is determined by the `options.forQuery` property:

- If `options.forQuery` is `true`, the `x-fp-signature` will be generated to use in query parameter.
- If `options.forQuery` is `false`, the `x-fp-signature` will be generated to use in headers.


## Example

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
      Authorization: "Bearer NjQ2NGIxMTY5YThjNmI3ZDUwMDVkMTJlOnVfeXhsWXBaQg==",
      "x-currency-code": "INR"
    },
};

const signature = sign(requestToSign)
```