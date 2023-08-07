import { encodeRfc3986 } from "../../src/utils"
import querystring from "querystring";

describe("Test encodeRfc3986", () => {
    it("Should encrypt string using key", async () => {
        
        const query = "https://api.fynd.com/service/application/catalog/v1.0/categories/winter/";
        const stringToEncrypt = querystring.stringify(querystring.parse(query));

        const expectedEncryption = "https%3A%2F%2Fapi.fynd.com%2Fservice%2Fapplication%2Fcatalog%2Fv1.0%2Fcategories%2Fwinter%2F=";

        const encryptedMsg = encodeRfc3986(stringToEncrypt);
        
        expect(encryptedMsg).toEqual(expectedEncryption);
    })
})
