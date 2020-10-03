import { PrismaClient } from "../../database/prisma/generated/client";
import express from "express";
import bodyParser from "body-parser";
import { applyHandler, Handler } from "./handler";
import createApiAuthenticationMiddleware from "./middleware/auth";
import { HybridRedisSessionStore } from "./session-store/redis-store";
import errorHandlerMiddleware from "./middleware/error";
import createTenantUsageMiddleware from "./middleware/tenant-usage";
import dotenv from "dotenv";
import { resolve } from "path";
import createSession from "./handlers/createSession";
import getSession from "./handlers/getSession";
import * as t from "io-ts";
import markSessionActive from "./handlers/markSessionActive";

dotenv.config({ path: resolve(__dirname, "../.env") });

const app = express();
const prisma = new PrismaClient();
const sessionStore = new HybridRedisSessionStore(
  process.env.PRIMARY_STORE_URL,
  process.env.CACHE_STORE_URL ?? process.env.FLY_REDIS_CACHE_URL
);
const handlers = [createSession, getSession, markSessionActive] as const;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(createApiAuthenticationMiddleware(sessionStore));
app.use(createTenantUsageMiddleware(sessionStore, prisma));
handlers.forEach((handler) => {
  applyHandler(app, (handler as unknown) as Handler<t.Any>, {
    prisma,
    sessionStore,
  });
});
app.use(errorHandlerMiddleware);

app.listen(process.env.PORT ?? 8080);
