import RequestSigner, { RequestParam } from '../../src/RequestSigner';


describe('Integration Test - sign method with mocked parameters', () => {
  let request: RequestParam;
  let secret: string;
  const mockDateTime = '2023-07-17T12:34:56.789Z';

  beforeEach(() => {

    secret = 'dummyCredentials';

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

  it('should call sign method with mocked parameters and mocked Date', () => {

    request = {
      method: "GET",
      port: 1234,
      path: "/service/application/theme/v1.0/applied-theme",
      signQuery: true,
      headers: {
        host: 'api.fynd.com',
        Authorization: "Bearer NjRhZjk2Zjc4MzI0MWRlMmFjZWQyYjVjOlM4aFFqWkxZVA==",
        "x-currency-code": "INR",
        "x-fp-sdk-version": "1.1.2",
      },
    };

    // Call the sign method
    const result = new RequestSigner(request, secret).sign();

    expect(result.path?.includes("x-fp-signature=v1.1%3A267a7bc88a9987670cedd16ca07bdec78da5471df94929d7dc18219a17c4ac47")).toBeTruthy();
  });

  it('should call sign method with mocked parameters and mocked Date', () => {

    request = {
      method: "POST",
      host: 'api.fynd.com',
      path: "/service/application/cart/v1.0/coupon",
      body: "{\"coupon_code\":\"dummyCouponCode\"}",
      headers: {
        Authorization: "Bearer NjRhZjk2Zjc4MzI0MWRlMmFjZWQyYjVjOlM4aFFqWkxZVA==",
        "x-currency-code": "INR",
        "x-fp-sdk-version": "1.1.2",
        "Content-Type": "application/json",
      },
    };

    // Call the sign method
    const result = new RequestSigner(request, secret).sign();

    expect(result.headers['x-fp-signature']).toEqual('v1.1:1c4c6979570f2f2a733ee4fd8b8905123448c78a5b70480d87a2e7ac8d66f675')
    expect(result.headers['x-fp-date']).toEqual("20230717T123456Z")
  });



});
