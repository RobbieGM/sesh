import { randomBytes } from "crypto";
import { Json } from "fp-ts/lib/Either";

export interface Session<TMetadata = Json> {
  /** ID of the user that is represented in the tenant-side database */
  userId: string | number;
  metadata?: TMetadata;
  /** Token expiration date (ISO string) */
  expiresAt?: Date;
  /** Token creation date (ISO string) */
  createdAt: Date;
  /** Restricts session to this IP address */
  ip?: string;
  /** Restricts session to client ID, such as a browser fingerprint */
  clientId?: string;
}

export interface SessionWithKey<TMetadata = Json> extends Session<TMetadata> {
  key: SessionKey;
}

export interface SessionKey {
  /** Session token */
  token: string;
  /** Arbitrary namespace to scope session tokens to */
  namespace: string;
}

/**
 * Represents a key-value session store. This abstraction has no concept of permissions or tenants.
 */
export interface SessionStore {
  /** Gets a session by its token */
  get(key: SessionKey): Promise<Session | null>;

  /**
   * Creates a session
   * @param session
   * @param namespace Token namespace
   * @param token Session token to store the session under, or omit to auto-generate
   */
  createSession(
    session: Session,
    namespace: string,
    token?: string
  ): Promise<string>;
  /** Resets the session's expiration date to last the amount it would have originally lasted, but starting now */
  markSessionActive(key: SessionKey): Promise<void>;
  updateSessionMetadata(key: SessionKey, metadata: Json): Promise<void>;
  /**
   * Deletes a session.
   * @returns true if the session was deleted, false if no session existed at the given key
   */
  deleteSession(key: SessionKey): Promise<boolean>;
}

export class NoSuchSessionError extends Error {}

/** Represents the data actually stored in the Redis store */
export type MarshalledSession = Omit<
  { [K in keyof Session]: string },
  "expiresAt"
>;

/**
 * Converts session to JSON
 */
export function marshalSession({
  expiresAt: _,
  ...session
}: Session): MarshalledSession {
  return {
    ...session,
    metadata: JSON.stringify(session.metadata),
    userId: JSON.stringify(session.userId),
    createdAt: session.createdAt.toISOString(),
  };
}

/**
 * Converts from JSON to session
 */
export function unmarshalSession(
  marshalledSession: MarshalledSession,
  expiresAt: Date | undefined
): Session {
  return {
    ...marshalledSession,
    userId: JSON.parse(marshalledSession.userId),
    metadata: marshalledSession.metadata
      ? JSON.parse(marshalledSession.metadata)
      : undefined,
    expiresAt,
    createdAt: new Date(marshalledSession.createdAt),
  };
}

export function generateSessionToken(): string {
  return randomBytes(16).toString("base64").replace(/[=/+]/g, "");
}
