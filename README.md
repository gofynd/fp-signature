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

The `sign` function is used to add a signature to a request. It takes two parameters: `request` and `options`.


```typescript
type RequestParam = {
  headers?: any;
  method: string;
  host?: string;
  hostname?: string;
  port?: number;
  path?: string;
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

#### Signature Placement

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