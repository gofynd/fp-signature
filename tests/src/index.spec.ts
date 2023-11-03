import { RequestParam } from "../../src/types";
import { sign } from "../../src";

describe("Integration Test - sign method with mocked parameters - new ", () => {
    let request: RequestParam;
    const mockDateTime = "2023-10-26T05:39:00.199Z"; // 20231026T053900Z

    beforeEach(() => {
        // Mock the Date object
        jest.spyOn(global, "Date").mockImplementationOnce(
            () => new Date(mockDateTime)
        );

        const mockedToISOString = jest
            .fn()
            .mockReturnValue(mockDateTime)
            .mockName("toISOString");

        // Assign the mocked toISOString to the Date.prototype
        Object.defineProperty(Date.prototype, "toISOString", {
            value: mockedToISOString,
            writable: true,
            configurable: true,
        });
    });

    it("should call sign method with mocked parameters and mocked Date - for headers", () => {
        request = {
            method: "GET",
            host: "api.fyndx5.de",
            path: "/service/application/configuration/v1.0/application",
            headers: {
                Authorization:
                    "Bearer NjQ2NGIxMTY5YThjNmI3ZDUwMDVkMTJlOnVfeXhsWXBaQg==",
                "x-location-detail": {
                    pincode: "385001",
                    country: "India",
                    city: "Ahmedabad",
                    location: { longitude: "72.585022", latitude: "23.033863" },
                },
                "x-currency-code": "INR",
                "x-fp-sdk-version": "1.3.4",
            },
        };

        const result = sign(request);

        expect(result["x-fp-signature"]).toEqual(
            "v1.1:e922d50be2a309cc7a3580a1f60cf19d6f82f2a4c5d1a52441a082e7500a2a61"
        );
        expect(result["x-fp-date"]).toEqual("20231026T053900Z");
    });

    it("should call sign method with mocked parameters and mocked Date - for query", () => {
        request = {
            method: "GET",
            host: "api.fyndx5.de",
            path: "/service/application/configuration/v1.0/application",
            headers: {
                Authorization:
                    "Bearer NjQ2NGIxMTY5YThjNmI3ZDUwMDVkMTJlOnVfeXhsWXBaQg==",
                "x-location-detail": {
                    pincode: "385001",
                    country: "India",
                    city: "Ahmedabad",
                    location: { longitude: "72.585022", latitude: "23.033863" },
                },
                "x-currency-code": "INR",
                "x-fp-sdk-version": "1.3.4",
            },
        };

        const result = sign(request, {
            signQuery: true,
        });

        expect(result["x-fp-signature"]).toEqual(
            "v1.1:38f6892758a50510d9cacbf70b5da73fa09d178104034544fc5587a113c80f9c"
        );
        expect(result["x-fp-date"]).toEqual("20231026T053900Z");
    });

    it("should call sign method with mocked parameters and mocked Date - get request with query param - for query", () => {
        request = {
            method: "GET",
            host: "api.fyndx5.de",
            path: "/service/common/configuration/v1.0/location?location_type=country",
            headers: {
                Authorization:
                    "Bearer NjQ2NGIxMTY5YThjNmI3ZDUwMDVkMTJlOnVfeXhsWXBaQg==",
                "x-location-detail": {
                    pincode: "385001",
                    country: "India",
                    city: "Ahmedabad",
                    location: { longitude: "72.585022", latitude: "23.033863" },
                },
                "x-currency-code": "INR",
                "x-fp-sdk-version": "1.3.4",
            },
        };

        // Call the sign method
        const result = sign(request, {
            signQuery: true,
        });
        
        expect(result["x-fp-signature"]).toEqual(
            "v1.1:8611d45b8aa82bd99188f2a3d77f053fda42a84427d8918cd9b316e04761b22d"
        );
        expect(result["x-fp-date"]).toEqual("20231026T053900Z");
    });

    it("should call sign method with mocked parameters and mocked Date - put request with body - for header", () => {
        request = {
            method: "PUT",
            host: "api.fyndx5.de",
            path: "/service/platform/company-profile/v1.0/company/379/brand/8799",
            body: {
                name: "GoFynd",
                logo: "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyndnp/wrkr/addsale/brands/pictures/square-logo/original/2EdLez-9f-Logo.webp",
                company_id: "5885",
                description: "dsafg",
                banner: {
                    landscape:
                        "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyndnp/wrkr/addsale/brands/pictures/landscape-banner/original/7raEvjs_JH-Landsacpe-Banner.png",
                    portrait:
                        "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyndnp/wrkr/addsale/brands/pictures/portrait-banner/original/El9Fv19CI-Portrait-Banner.webp",
                },
                _locale_language: {},
                uid: "8799",
            },
            headers: {
                Authorization:
                    "Bearer oa-e3e69efcc07494193eee2d92b21a5f285a9dad07",
                "x-fp-sdk-version": "1.3.4",
                "Content-Type": "application/json",
            },
        };

        const result = sign(request);

        expect(result["x-fp-signature"]).toEqual(
            "v1.1:97b6907351dba0660dc405c8040a4de750d3663c8dbc5cb510cbd4f62a3524ed"
        );
        expect(result["x-fp-date"]).toEqual("20231026T053900Z");
    });
});
