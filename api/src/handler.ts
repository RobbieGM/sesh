import { Express } from "express";
import { fold, Json } from "fp-ts/lib/Either";
import { OutgoingHttpHeaders } from "http";
import * as t from "io-ts";
import { PrismaClient } from "../../database/prisma/generated/client";
import { SessionStore } from "./session-store";
import { StringifiableJson } from "./utils/json";

interface Response {
  statusCode?: number;
  headers?: OutgoingHttpHeaders;
  data: StringifiableJson;
}

export interface Handler<T extends t.Any = t.Any> {
  method: "get" | "post" | "patch" | "delete";
  path: string;
  requestDataType: T;
  handler: (
    requestData: t.TypeOf<T>,
    context: Context
  ) => Response | Promise<Response>;
}

interface Context {
  tenantId: number;
  sessionStore: SessionStore;
  prisma: PrismaClient;
}

export function createHandler<T extends t.Any>(
  [method, path]: [method: Handler["method"], path: string],
  requestDataType: T,
  handler: Handler<T>["handler"]
): Handler<T> {
  return { method, path, requestDataType, handler };
}

export function applyHandler<T extends t.Any>(
  app: Express,
  handler: Handler<T>,
  context: Pick<Context, "prisma" | "sessionStore">
): void {
  app[handler.method](handler.path, async (req, res) => {
    const tenantId = req.tenantSession.userId as number;
    const data = { ...req.params, ...req.query, ...req.body };
    const response = await fold<
      t.Errors,
      t.TypeOf<T>,
      Response | Promise<Response>
    >(
      (errors) => ({ statusCode: 400, data: (errors as unknown) as Json }),
      (requestData) => handler.handler(requestData, { ...context, tenantId })
    )(handler.requestDataType.decode(data));
    res.status(response.statusCode ?? 200);
    Object.entries(response.headers ?? {}).forEach(([key, value]) => {
      if (value != null) {
        res.setHeader(key, value);
      }
    });
    res.json(response.data);
  });
}
