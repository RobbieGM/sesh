import * as t from "io-ts";
import { createHandler } from "../handler";
import { ErrorCode, HttpError } from "../middleware/error";
import { Session } from "../session-store";
import { StringifiableJsonRecord } from "../utils/json";

function sessionToJson(session: Session): StringifiableJsonRecord {
  return {
    ...session,
    expiresAt: session.expiresAt?.toISOString(),
    createdAt: session.createdAt.toISOString(),
  };
}

export default createHandler(
  ["get", "/sessions/:token"],
  t.intersection([
    t.type({
      token: t.string,
    }),
    t.partial({ ip: t.string, clientId: t.string }),
  ]),
  async (data, { sessionStore, tenantId }) => {
    const session = await sessionStore.get({
      token: data.token,
      namespace: tenantId.toString(),
    });
    if (session == null) {
      throw new HttpError(ErrorCode.NotFound, "Session does not exist.");
    }
    if (
      (session.ip != null && data.ip !== session.ip) ||
      (session.clientId != null && data.clientId !== session.clientId)
    ) {
      throw new HttpError(
        ErrorCode.NotFound,
        "Provided IP or client ID do not match session's security restrictions."
      );
    }
    return { data: sessionToJson(session) };
  }
);
