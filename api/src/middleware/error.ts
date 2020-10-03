import { ErrorRequestHandler } from "express";

export const enum ErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  URITooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,

  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HTTPVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

export class HttpError extends Error {
  constructor(
    public statusCode: ErrorCode,
    message: string,
    public headers: Record<string, string | number | string[]> = {}
  ) {
    super(message);
  }
}

// 4th parameter (_next) is required for express to differentiate between error handler middleware and
// normal middleware
const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, _next) => {
  const sentError =
    err instanceof HttpError
      ? err
      : new HttpError(ErrorCode.InternalServerError, "Internal server error");
  if (process.env.NODE_ENV === "development") {
    console.error("Caught error in request:", err);
  }
  Object.entries(sentError.headers).forEach(([key, value]) =>
    res.setHeader(key, value)
  );
  if (!res.headersSent) {
    return res.status(sentError.statusCode).json({ error: sentError.message });
  }
};

export default errorHandlerMiddleware;
