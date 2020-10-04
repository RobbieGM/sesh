import { either } from "fp-ts/lib/Either";
import * as t from "io-ts";
import { createHandler } from "../handler";
import { DummyJsonType } from "../utils/json";

const DateFromISOString = new t.Type<Date, string, unknown>(
  "DateFromISOString",
  (u): u is Date => u instanceof Date,
  (u, c) =>
    either.chain(t.string.validate(u, c), (s) => {
      const d = new Date(s);
      return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
    }),
  (a) => a.toISOString()
);

export default createHandler(
  ["post", "/sessions"],
  t.intersection([
    t.type({ userId: t.union([t.string, t.number]) }),
    t.partial({
      metadata: DummyJsonType,
      expiresAt: DateFromISOString,
      ip: t.string,
      clientId: t.string,
    }),
  ]),
  async (data, { sessionStore, appId }) => {
    const token = await sessionStore.createSession(
      { ...data, createdAt: new Date() },
      appId.toString()
    );
    return { data: token };
  }
);
