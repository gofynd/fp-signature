import { hash, hmac, encodeRfc3986, encodeRfc3986Full } from "../../src/utils"
import querystring from "querystring";

describe("Test hmac", () => {
    it("Should encrypt string using key", async () => {
        const key = "keyToEncrypt";
        const stringToEncrypt = "This is secret message to encrypt";

        const expectedEncryption = "baa3f0a60d6cdb60e23aa7c5369e3a27e11632248d56e752cc96cafa7ade5aec";

        const encryptedMsg = hmac(key, stringToEncrypt, "");

        expect(encryptedMsg).toEqual(expectedEncryption);
    })
})


describe("Test hash", () => {
    it("Should encrypt string", async () => {
        const stringToEncrypt = "This is secret message to encrypt";

        const expectedEncryption = "371012995da8d3fc71181c0e0fdc36690c156916dc2458626852ad8f0e9f11d7";

        const encryptedMsg = hash(stringToEncrypt, "");

        expect(encryptedMsg).toEqual(expectedEncryption);
    })
})


describe("Test encodeRfc3986", () => {
    it("Should encrypt string using key", async () => {
        
        const query = "https://api.fynd.com/service/application/catalog/v1.0/categories/winter/";
        const stringToEncrypt = querystring.stringify(querystring.parse(query));

        const expectedEncryption = "https%3A%2F%2Fapi.fynd.com%2Fservice%2Fapplication%2Fcatalog%2Fv1.0%2Fcategories%2Fwinter%2F=";

        const encryptedMsg = encodeRfc3986(stringToEncrypt);
        
        expect(encryptedMsg).toEqual(expectedEncryption);
    })
})


describe("Test encodeRfc3986Full", () => {
    it("Should encrypt string", async () => {
        const stringToEncrypt = "This is secret message to encrypt";

        const expectedEncryption = "This is secret message to encrypt";

        const encryptedMsg = encodeRfc3986Full(stringToEncrypt);

        expect(encryptedMsg).toEqual(expectedEncryption);
    })
})

