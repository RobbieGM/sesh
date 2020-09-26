import { PrismaClient } from "../../database/prisma/generated/client";
import test from "./handlers/test";
import express from "express";
import bodyParser from "body-parser";
import { applyHandler } from "./handler";
import createApiAuthenticationMiddleware from "./middleware/auth";
import { HybridRedisSessionStore } from "./session-store/redis-store";
import errorHandlerMiddleware from "./middleware/error";
import createTenantUsageMiddleware from "./middleware/tenant-usage";
import { config } from "dotenv";

config();

const app = express();
const prisma = new PrismaClient();
const sessionStore = new HybridRedisSessionStore(
  process.env.PRIMARY_STORE_URL,
  process.env.CACHE_STORE_URL ?? process.env.FLY_REDIS_CACHE_URL
);
const handlers = [test];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(createApiAuthenticationMiddleware(sessionStore));
app.use(createTenantUsageMiddleware(sessionStore, prisma));
handlers.forEach((handler) => applyHandler(app, handler, { prisma }));
app.use(errorHandlerMiddleware);

app.listen(process.env.PORT ?? 8080);
