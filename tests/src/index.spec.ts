import { RequestParam } from "../../src/types";
import { sign } from "../../src";

describe("Request Signing Tests", () => {
    const mockDateTime = "20231026T053900Z";
    const secret = '1234567';

    describe("GET Request Tests", () => {
        it("should sign GET request with x-fp-date in headers", () => {
            const request: RequestParam = {
                method: "GET",
                host: "api.fyndx5.de",
                path: "/service/application/configuration/v1.0/application",
                headers: {
                    "x-fp-date": mockDateTime,
                    "x-fp-sdk-version": "1.3.4",
                },
            };

            const result = sign(request, { secret });

            expect(result).toEqual(
                "v1.1:e922d50be2a309cc7a3580a1f60cf19d6f82f2a4c5d1a52441a082e7500a2a61"
            );
        });

        it("should sign GET request with x-fp-date in query parameters", () => {
            const request: RequestParam = {
                method: "GET",
                host: "api.fyndx5.de",
                path: `/service/application/configuration/v1.0/application?x-fp-date=${mockDateTime}`,
                headers: {
                    "x-fp-sdk-version": "1.3.4",
                },
            };

            const result = sign(request, { secret });

            expect(result).toEqual(
                "v1.1:38f6892758a50510d9cacbf70b5da73fa09d178104034544fc5587a113c80f9c"
            );
        });

        it("should sign GET request with additional query parameters and x-fp-date in query", () => {
            const request: RequestParam = {
                method: "GET",
                host: "api.fyndx5.de",
                path: `/service/common/configuration/v1.0/location?location_type=country&x-fp-date=${mockDateTime}`,
                headers: {
                    "x-fp-sdk-version": "1.3.4",
                },
            };

            const result = sign(request, { secret });
            
            expect(result).toEqual(
                "v1.1:8611d45b8aa82bd99188f2a3d77f053fda42a84427d8918cd9b316e04761b22d"
            );
        });
    });

    describe("POST Request Tests", () => {
        it("should sign POST request with x-fp-date in headers", () => {
            const request: RequestParam = {
                method: "POST",
                host: "api.fyndx5.de",
                path: "/service/application/test/v1.0/endpoint",
                body: { test: "data" },
                headers: {
                    "x-fp-date": mockDateTime,
                    "x-fp-sdk-version": "1.3.4",
                    "Authorization": "Bearer test-token",
                    "Content-Type": "application/json",
                },
            };

            const result = sign(request, { secret });

            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
            expect(result).toMatch(/^v1\.1:[a-f0-9]{64}$/);
        });

        it("should sign POST request with x-fp-date in query parameters", () => {
            const request: RequestParam = {
                method: "POST",
                host: "api.fyndx5.de",
                path: `/service/application/test/v1.0/endpoint?x-fp-date=${mockDateTime}`,
                body: { test: "data" },
                headers: {
                    "x-fp-sdk-version": "1.3.4",
                    "Authorization": "Bearer test-token",
                    "Content-Type": "application/json",
                },
            };

            const result = sign(request, { secret });

            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
            expect(result).toMatch(/^v1\.1:[a-f0-9]{64}$/);
        });
    });

    describe("PUT Request Tests", () => {
        it("should sign PUT request with x-fp-date in headers", () => {
            const request: RequestParam = {
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
                    "x-fp-sdk-version": "1.3.4",
                    "x-fp-date": mockDateTime,
                },
            };

            const result = sign(request, { secret });

            expect(result).toEqual(
                "v1.1:97b6907351dba0660dc405c8040a4de750d3663c8dbc5cb510cbd4f62a3524ed"
            );
        });

        it("should sign PUT request with x-fp-date in query parameters", () => {
            const request: RequestParam = {
                method: "PUT",
                host: "api.fyndx5.de",
                path: `/service/platform/company-profile/v1.0/company/379/brand/8799?x-fp-date=${mockDateTime}`,
                body: {
                    name: "Updated Company",
                    description: "Updated description",
                },
                headers: {
                    "x-fp-sdk-version": "1.3.4",
                    "Content-Type": "application/json",
                },
            };

            const result = sign(request, { secret });

            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
            expect(result).toMatch(/^v1\.1:[a-f0-9]{64}$/);
        });
    });

    describe("DELETE Request Tests", () => {
        it("should sign DELETE request with x-fp-date in headers", () => {
            const request: RequestParam = {
                method: "DELETE",
                host: "api.fyndx5.de",
                path: "/service/platform/company-profile/v1.0/company/379/brand/8799",
                headers: {
                    "x-fp-date": mockDateTime,
                    "x-fp-sdk-version": "1.3.4",
                    "Authorization": "Bearer test-token",
                },
            };

            const result = sign(request, { secret });

            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
            expect(result).toMatch(/^v1\.1:[a-f0-9]{64}$/);
        });

        it("should sign DELETE request with x-fp-date in query parameters", () => {
            const request: RequestParam = {
                method: "DELETE",
                host: "api.fyndx5.de",
                path: `/service/platform/company-profile/v1.0/company/379/brand/8799?x-fp-date=${mockDateTime}`,
                headers: {
                    "x-fp-sdk-version": "1.3.4",
                    "Authorization": "Bearer test-token",
                },
            };

            const result = sign(request, { secret });

            expect(result).toBeDefined();
            expect(typeof result).toBe("string");
            expect(result).toMatch(/^v1\.1:[a-f0-9]{64}$/);
        });
    });

    describe("Error Handling Tests", () => {
        it("should throw error when no x-fp-date is provided", () => {
            const request: RequestParam = {
                method: "GET",
                host: "api.fyndx5.de",
                path: "/service/application/configuration/v1.0/application",
                headers: {
                    "x-fp-sdk-version": "1.3.4",
                },
            };

            expect(() => {
                sign(request, { secret });
            }).toThrow("x-fp-date timestamp is required. Please provide it in headers or query parameters.");
        });

        it("should throw error when x-fp-date is empty string", () => {
            const request: RequestParam = {
                method: "GET",
                host: "api.fyndx5.de",
                path: "/service/application/configuration/v1.0/application",
                headers: {
                    "x-fp-date": "",
                    "x-fp-sdk-version": "1.3.4",
                },
            };

            expect(() => {
                sign(request, { secret });
            }).toThrow("x-fp-date timestamp is required. Please provide it in headers or query parameters.");
        });
    });
});
