const axios = require("axios").default;
const { sign } = require("@gofynd/fp-signature")

const requestToSign = {
  method: "GET",
  host: "api.fynd.com",
  path: "/service/application/configuration/v1.0/application?x-fp-signature=v1.1%3A38555f0f81ac778036a0d2eeb53c872dc05ca8e5ad133d24e8e197994fbc7dac&x-fp-date=20231129T121756Z",
  headers: {
    Authorization: "Bearer <authorizationToken>",
    "x-currency-code": "INR"
  },
};

const signature = sign(requestToSign, {
  signQuery: true
});

const res = axios.get("http://api.fynd.com/service/application/configuration/v1.0/application", {
  params: {
    "x-fp-signature": signature["x-fp-signature"],
    "x-fp-date": signature["x-fp-date"]
  }, 
  headers: {
    Authorization: "Bearer <authorizationToken>",
    "x-currency-code": "INR"
  }
});

// To get path string with query parameters
const host = "http://api.fynd.com";
const path = "/service/application/configuration/v1.0/application";
const url = new URL(host + path);
url.searchParams.set("x-fp-signature", signature["x-fp-signature"])
url.searchParams.set("x-fp-date", signature["x-fp-date"])
console.log(url.href)