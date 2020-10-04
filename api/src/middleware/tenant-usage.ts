import { differenceInCalendarMonths } from "date-fns";
import { RequestHandler } from "express";
import { Json } from "fp-ts/lib/Either";
import {
  PrismaClient,
  UsageRecord,
} from "../../../database/prisma/generated/client";
import { Session, SessionStore } from "../session-store";
import { APISessionMetadata } from "./auth";
import { ErrorCode, HttpError } from "./error";

function getMonthNumber(date: Date) {
  const epoch = 0;
  // returns int
  return differenceInCalendarMonths(date, epoch);
}

function ensureTenantHasNotExceededQuota(session: Session<APISessionMetadata>) {
  const preventUsageUntilMonth = session.metadata?.preventUsageUntilMonth;
  if (
    preventUsageUntilMonth != null &&
    getMonthNumber(new Date()) < preventUsageUntilMonth
  ) {
    throw new HttpError(
      ErrorCode.TooManyRequests,
      "You have exceeded your API usage quota for this month."
    );
  }
}

function getUsageCost(
  usage: Pick<UsageRecord, "apiCalls" | "sessionsCreated">
) {
  const apiCallsCost =
    Math.min(
      0,
      usage.apiCalls - parseInt(process.env.FREE_API_CALLS_PER_MONTH)
    ) * parseFloat(process.env.COST_PER_API_CALL);
  const sessionsCost =
    Math.min(
      0,
      usage.sessionsCreated - parseInt(process.env.FREE_SESSIONS_PER_MONTH)
    ) * parseFloat(process.env.COST_PER_SESSION_CREATED);
  return apiCallsCost + sessionsCost;
}

const createTenantUsageMiddleware = (
  sessionStore: SessionStore,
  prisma: PrismaClient
): RequestHandler => async (req, res, next) => {
  ensureTenantHasNotExceededQuota(req.tenantSession);
  next();
  const tenantId = req.tenantSession.userId as number;
  const monthNumber = getMonthNumber(new Date());
  const {
    tenant: { pricingPlan },
    ...usage
  } = await prisma.usageRecord.upsert({
    where: {
      tenantId_monthNumber: {
        tenantId,
        monthNumber,
      },
    },
    update: {
      apiCalls: {
        increment: 1,
      },
    },
    create: {
      apiCalls: 1,
      tenant: {
        connect: {
          id: tenantId,
        },
      },
      monthNumber,
      sessionsCreated: 0,
    },
    select: {
      apiCalls: true,
      sessionsCreated: true,
      tenant: {
        select: {
          pricingPlan: true,
        },
      },
    },
  });
  if (pricingPlan == "FREE" && getUsageCost(usage) > 0) {
    const metadata: APISessionMetadata = {
      ...req.tenantSession.metadata!,
      preventUsageUntilMonth: 3,
    };
    await sessionStore.updateSessionMetadata(
      req.tenantSession.key,
      (metadata as unknown) as Json
    );
  }
};

export default createTenantUsageMiddleware;
