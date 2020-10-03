import { either, Json } from "fp-ts/lib/Either";
import * as t from "io-ts";
import { createHandler } from "../handler";

// Dummy JSON type validates everything since only JSON is possible as API input anyway
const Json = new t.Type<Json, Json, unknown>(
  "Json",
  (input: unknown): input is Json => true,
  (input) => t.success(input as Json),
  t.identity
);

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
      metadata: Json,
      expiresAt: DateFromISOString,
      ip: t.string,
      clientId: t.string,
    }),
  ]),
  async (data, { sessionStore, tenantId }) => {
    const token = await sessionStore.createSession(
      { ...data, createdAt: new Date() },
      tenantId.toString()
    );
    return { data: token };
  }
);
