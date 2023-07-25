# GATEKEEPER

Fynd platform's signature logic



Gatekeeper is a versatile npm package that provides signature logic for Fynd platform requests. This package supports both CommonJS and ES modules, and it also comes with a web bundle for direct usage in browsers.

## Installation

You can install Gatekeeper via npm:

```bash
npm install @gofynd/gatekeeper
```

## How to Use

### For CommonJS

```javascript
const { sign } = require("@gofynd/gatekeeper");
```

### For ES Modules

```javascript
import { sign } from "@gofynd/gatekeeper";
```

### For Browser

```html
<script src="./node_modules/@gofynd/gatekeeper/dist/web/gatekeeper.js"></script>
<script>
    // Gatekeeper library will be attached to the global window object
    Gatekeeper.sign();
</script>
```

## Functionality

### `sign` function

The `sign` function is used to add a signature to a request. It takes two parameters: `request` and `kCredentials`.


```typescript
type RequestParam = {
  headers?: any;
  method: string;
  host?: string;
  hostname?: string;
  port?: number;
  path?: string;
  body?: any;
  service?: any;
  region?: any;
  signQuery?: boolean // It true, signature will be added as query in request
  doNotEncodePath?: boolean;
  doNotModifyHeaders?: boolean; 
};


function sign(request : RequestParam, kCredentials: any) {}
```

#### Signature Placement

The placement of the signature (`x-fp-signature`) in the request is determined by the `signQuery` property:

- If `request.signQuery` is `true`, the `x-fp-signature` will be added as a query parameter.
- If `request.signQuery` is `false`, the `x-fp-signature` will be added as a header.

