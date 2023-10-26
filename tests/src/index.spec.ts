import { RequestParam } from "../../src/types";
import {sign} from '../../src';


describe('Integration Test - sign method with mocked parameters - new ', () => {
  let request: RequestParam;
  let secret: string;
  const mockDateTime = '2023-10-26T05:39:00.199Z';

  beforeEach(() => {

    secret = '1234567';

    // Mock the Date object
    jest.spyOn(global, 'Date').mockImplementationOnce(() => new Date(mockDateTime));
    
    const mockedToISOString = jest.fn()
        .mockReturnValue(mockDateTime)
        .mockName('toISOString');

    // Assign the mocked toISOString to the Date.prototype
    Object.defineProperty(Date.prototype, 'toISOString', {
      value: mockedToISOString,
      writable: true,
      configurable: true,
    });

  });

  it('should call sign method with mocked parameters and mocked Date - for headers', () => {

    request = {
      "method": "GET",
      "host": "api.fyndx5.de",
      "path": "/service/application/configuration/v1.0/application",
      "headers": {
        "Authorization": "Bearer NjQ2NGIxMTY5YThjNmI3ZDUwMDVkMTJlOnVfeXhsWXBaQg==",
        "x-location-detail": {"pincode":"385001","country":"India","city":"Ahmedabad","location":{"longitude":"72.585022","latitude":"23.033863"}},
        "x-currency-code": "INR",
        "x-fp-sdk-version": "1.3.4"
      }
    };

    // Call the sign method
    const result = sign(request);

    expect(result['x-fp-signature']).toEqual('v1.1:e922d50be2a309cc7a3580a1f60cf19d6f82f2a4c5d1a52441a082e7500a2a61')
    expect(result['x-fp-date']).toEqual('20231026T053900Z')
  });

  it('should call sign method with mocked parameters and mocked Date - for query', () => {

    request = {
      "method": "GET",
      "host": "api.fyndx5.de",
      "path": "/service/application/configuration/v1.0/application",
      "headers": {
        "Authorization": "Bearer NjQ2NGIxMTY5YThjNmI3ZDUwMDVkMTJlOnVfeXhsWXBaQg==",
        "x-location-detail": {"pincode":"385001","country":"India","city":"Ahmedabad","location":{"longitude":"72.585022","latitude":"23.033863"}},
        "x-currency-code": "INR",
        "x-fp-sdk-version": "1.3.4"
      }
    };

    // Call the sign method
    const result = sign(request, {
      forQuery: true
    });

    expect(result['x-fp-signature']).toEqual('v1.1:38f6892758a50510d9cacbf70b5da73fa09d178104034544fc5587a113c80f9c')
    expect(result['x-fp-date']).toEqual('20231026T053900Z')
  });
})