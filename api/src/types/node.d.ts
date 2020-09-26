declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";

    // Secrets
    PRIMARY_STORE_URL: string;
    FLY_REDIS_CACHE_URL: string;
    CACHE_STORE_URL: string;

    // Config
    PORT?: string;
    FREE_API_CALLS_PER_MONTH: string;
    COST_PER_API_CALL: string;
    FREE_SESSIONS_PER_MONTH: string;
    COST_PER_SESSION_CREATED: string;
  }
}
