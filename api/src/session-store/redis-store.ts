import { Json } from "fp-ts/lib/Either";
import Redis from "ioredis";
import {
  generateSessionToken,
  MarshalledSession,
  marshalSession,
  NoSuchSessionError,
  Session,
  SessionKey,
  SessionStore,
  unmarshalSession,
} from ".";
import { excludeUndefinedFromObjectValues } from "../utils/json";

/**
 * Converts a SessionKey to a key string for use in a Redis store.
 */
function serializeKey({ token, namespace }: SessionKey) {
  return `${namespace}:${token}`;
}

/**
 * A session store which uses redis to store keys
 */
class RedisSessionStore implements SessionStore {
  private store;
  constructor(url: string) {
    this.store = new Redis(url);
  }

  async get(sessionKey: SessionKey) {
    const key = serializeKey(sessionKey);
    const [marshalledSession, timeToLiveMilliseconds] = await Promise.all([
      this.store.hgetall(key) as Promise<
        MarshalledSession | Record<string, unknown>
      >,
      this.store.pttl(key),
    ]);
    if (Object.keys(marshalledSession).length === 0) {
      return null;
    }
    const expiresAt =
      timeToLiveMilliseconds === -1
        ? undefined
        : new Date(Date.now() + timeToLiveMilliseconds);
    return unmarshalSession(marshalledSession as MarshalledSession, expiresAt);
  }

  /**
   * Sets a session at the given token key, and overwrites any data there. In most cases, this method should
   * be avoided in favor of other functions which update the session.
   */
  async set(sessionKey: SessionKey, session: Session): Promise<void> {
    const key = serializeKey(sessionKey);
    await this.store.hmset(
      key,
      excludeUndefinedFromObjectValues(marshalSession(session))
    );
    if (session.expiresAt) {
      // Don't await, better to return generated token as soon as session is accessible from the store
      this.store.pexpireat(key, session.expiresAt.getTime());
    }
  }

  async createSession(
    session: Session,
    namespace: string,
    sessionToken?: string
  ) {
    const token = sessionToken ?? generateSessionToken();
    this.set({ namespace, token }, session);
    return token;
  }

  async markSessionActive(key: SessionKey) {
    const [createdAt, expiresAt] = await this.store.hmget(
      serializeKey(key),
      "createdAt",
      "expiresAt"
    );
    if (createdAt == null) throw new NoSuchSessionError();
    if (expiresAt == null) return;
    const timeToLiveMilliseconds =
      Date.parse(expiresAt) - Date.parse(createdAt);
    const newExpirationDate = new Date(
      Date.now() + timeToLiveMilliseconds
    ).toISOString();
    this.store.hset(serializeKey(key), "expiresAt", newExpirationDate);
  }

  async updateSessionMetadata(sessionKey: SessionKey, metadata: Json) {
    const key = serializeKey(sessionKey);
    if (!(await this.store.exists(key))) {
      throw new NoSuchSessionError();
    }
    await this.store.hset(key, "metadata", JSON.stringify(metadata));
  }

  async deleteSession(key: SessionKey) {
    return (await this.store.del(serializeKey(key))) > 0;
  }
}

function sessionNeedsUpdate(
  first: Session | null,
  second: Session | null
): boolean {
  if (first == null && second == null) return false;
  if (first == null || second == null) return true;
  const toleranceMilliseconds = 1000;
  const sessionDataIsEqual =
    JSON.stringify(marshalSession(first)) !==
    JSON.stringify(marshalSession(second));
  const expirationDateIsWithinTolerance =
    first.expiresAt == second.expiresAt
      ? true
      : first.expiresAt == null || second.expiresAt == null
      ? false
      : Math.abs(first.expiresAt.getTime() - second.expiresAt.getTime()) <
        toleranceMilliseconds;
  return !sessionDataIsEqual || !expirationDateIsWithinTolerance;
}

/**
 * A session store which uses two redis stores, one primary store and one cache store for quicker access
 */
export class HybridRedisSessionStore implements SessionStore {
  /** Primary store, where changes should be synchronized to and from eventually */
  private primaryStore;
  /** Cache storage, for quick access */
  private cacheStore;

  constructor(primaryUrl: string, cacheUrl: string) {
    this.primaryStore = new RedisSessionStore(primaryUrl);
    this.cacheStore = new RedisSessionStore(cacheUrl);
  }

  /**
   * Performs an action on both stores, returning the value that was returned from the faster of the two.
   */
  private raceStores<T>(consumer: (store: SessionStore) => Promise<T>) {
    return Promise.race([
      consumer(this.cacheStore),
      consumer(this.primaryStore),
    ]);
  }

  private allStores<T>(
    consumer: (store: SessionStore) => Promise<T>
  ): Promise<[cacheResult: T, primaryResult: T]> {
    return Promise.all([
      consumer(this.cacheStore),
      consumer(this.primaryStore),
    ]);
  }

  get(key: SessionKey): Promise<Session | null> {
    return new Promise((res) => {
      const cachedPromise = this.cacheStore.get(key);
      const primaryPromise = this.primaryStore.get(key);
      // Return the result of the faster storage mechanism (usually cache, but may be primary if cache is under high load)
      Promise.race([cachedPromise, primaryPromise]).then((session) =>
        res(session)
      );
      Promise.all([cachedPromise, primaryPromise]).then(
        ([cachedSession, primarySession]) => {
          if (sessionNeedsUpdate(cachedSession, primarySession)) {
            if (primarySession != null) {
              this.cacheStore.set(key, primarySession);
            } else {
              this.cacheStore.deleteSession(key);
            }
          }
        }
      );
    });
  }

  createSession(
    session: Session,
    namespace: string,
    sessionToken?: string
  ): Promise<string> {
    const token = sessionToken ?? generateSessionToken();
    return this.raceStores((store) =>
      store.createSession(session, namespace, token)
    );
  }

  markSessionActive(key: SessionKey): Promise<void> {
    return this.raceStores((store) => store.markSessionActive(key));
  }

  updateSessionMetadata(key: SessionKey, metadata: Json): Promise<void> {
    return this.raceStores((store) =>
      store.updateSessionMetadata(key, metadata)
    );
  }

  async deleteSession(key: SessionKey): Promise<boolean> {
    return (await this.allStores((store) => store.deleteSession(key)))[1];
  }
}
