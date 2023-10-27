const axios = require("axios").default;
const { sign } = require("@gofynd/fp-signature")

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
