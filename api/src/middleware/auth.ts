import { RequestHandler } from "express";
import {
  Session,
  SessionKey,
  SessionStore,
  SessionWithKey,
} from "../session-store";
import { ErrorCode, HttpError } from "./error";

export interface APISessionMetadata {
  /** Can be set to next month when tenant goes over monthly limit */
  preventUsageUntilMonth?: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      tenantSession: SessionWithKey<APISessionMetadata>;
    }
  }
}

export const API_SESSION_NAMESPACE = "api";

function getSessionKey(authorizationHeader: string | undefined): SessionKey {
  const bearerAuthMatch = authorizationHeader?.match(/Bearer (\w+)/);
  if (bearerAuthMatch == null)
    throw new HttpError(
      ErrorCode.Unauthorized,
      "Authorization header is unparseable or absent."
    );
  const [, apiKey] = bearerAuthMatch;
  return { token: apiKey, namespace: API_SESSION_NAMESPACE };
}

/**
 * Creates express middleware which verifies tenants and tracks the number of API calls they make in the usage
 * record table.
 */
const createApiAuthenticationMiddleware = (
  sessionStore: SessionStore
): RequestHandler => async (req, res, next) => {
  const key = getSessionKey(req.headers.authorization);
  const session = (await sessionStore.get(key)) as Session<
    APISessionMetadata
  > | null;
  if (session == null) {
    throw new HttpError(ErrorCode.Unauthorized, "Invalid API key");
  }
  req.tenantSession = { ...session, key };
  next();
};

export default createApiAuthenticationMiddleware;
