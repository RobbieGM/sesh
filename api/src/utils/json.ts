import { Json } from "fp-ts/lib/Either";
import * as t from "io-ts";

/**
 * Represents valid JSON but allows undefined values as well, as those are ignored by JSON.stringify.
 */
export type StringifiableJson =
  | string
  | number
  | boolean
  | null
  | undefined
  | ReadonlyArray<StringifiableJson>
  | StringifiableJsonRecord;
export interface StringifiableJsonRecord {
  [key: string]: StringifiableJson;
}
type NonNullableKeysOf<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];
/**
 * Picks from an object only the keys whose values are not equal to undefined.
 */
export function excludeUndefinedFromObjectValues<T>(
  object: T
): Pick<T, NonNullableKeysOf<T>> {
  return Object.entries(object)
    .filter(([, value]) => value !== undefined)
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}) as Pick<
    T,
    NonNullableKeysOf<T>
  >;
}

/** Dummy JSON type validates everything since only JSON is possible as API input anyway */
export const DummyJsonType = new t.Type<Json, Json, unknown>(
  "Json",
  (input: unknown): input is Json => true,
  (input) => t.success(input as Json),
  t.identity
);
