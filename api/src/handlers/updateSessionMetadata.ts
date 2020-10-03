import { createHandler } from "../handler";
import * as t from "io-ts";
import { NoSuchSessionError } from "../session-store";
import { HttpError } from "../middleware/error";
import { DummyJsonType } from "../utils/json";

export default createHandler(
  ["patch", "/sessions/:token/metadata"],
  t.type({ token: t.string, metadata: DummyJsonType }),
  async ({ token, metadata }, { sessionStore, tenantId }) => {
    try {
      await sessionStore.updateSessionMetadata(
        {
          token,
          namespace: tenantId.toString(),
        },
        metadata
      );
    } catch (e) {
      if (e instanceof NoSuchSessionError) {
        throw new HttpError(404, "A session with that token does not exist.");
      } else throw e;
    }
    return { statusCode: 204, data: null };
  }
);
