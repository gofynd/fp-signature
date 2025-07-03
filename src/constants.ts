export const HEADERS_TO_IGNORE : Record<string, boolean> = {
  authorization: true,
  connection: true,
  "x-amzn-trace-id": true,
  "user-agent": true,
  expect: true,
  "presigned-expires": true,
  range: true,
};

export const HEADERS_TO_INCLUDE: string[] = ["x-fp-.*", "host", "x-user-data"];