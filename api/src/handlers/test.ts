import { createHandler } from "../handler";
import * as t from "io-ts";

export default createHandler(
  ["get", "/test"],
  t.type({}),
  (_data, { tenantId }) => {
    return { data: `Your tenant id is ${tenantId}` };
  }
);
