const axios = require("axios").default;
const { sign } = require("@gofynd/fp-signature")

// Example: Using FP-Signature with x-fp-date header
const requestToSign = {
  method: "GET",
  host: "api.fynd.com",
  path: "/service/application/configuration/v1.0/application",
  headers: {
    Authorization: "Bearer <authorizationToken>",
    "x-currency-code": "INR",
    "x-fp-date": new Date().toISOString().replace(/[:\-]|\.\d{3}/g, "")
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

console.log("x-fp-signature:", signature);
