import { createHandler } from "../handler";
import * as t from "io-ts";
import { ErrorCode, HttpError } from "../middleware/error";
export default createHandler(
  ["delete", "/sessions/:token"],
  t.type({ token: t.string }),
  async ({ token }, { sessionStore, tenantId }) => {
    const wasRemoved = await sessionStore.deleteSession({
      token,
      namespace: tenantId.toString(),
    });
    if (wasRemoved) {
      return { statusCode: 204, data: null };
    } else {
      throw new HttpError(
        ErrorCode.NotFound,
        "A session with that token does not exist."
      );
    }
  }
);
