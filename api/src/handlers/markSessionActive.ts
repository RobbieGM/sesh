import { createHandler } from "../handler";
import * as t from "io-ts";
import { NoSuchSessionError } from "../session-store";
import { HttpError } from "../middleware/error";

export default createHandler(
  ["patch", "/sessions/:token/activity"],
  t.type({ token: t.string }),
  async ({ token }, { sessionStore, appId }) => {
    try {
      await sessionStore.markSessionActive({
        token,
        namespace: appId.toString(),
      });
    } catch (e) {
      if (e instanceof NoSuchSessionError) {
        throw new HttpError(404, "A session with that token does not exist.");
      } else throw e;
    }
    return { statusCode: 204, data: null };
  }
);
