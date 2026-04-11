import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { listAudit as listAudit_handler } from "../../../../audit\\list.js";
type listAudit_Type = WithCallOpts<typeof listAudit_handler>;
declare const listAudit: listAudit_Type;
export { listAudit };

import { log as log_handler } from "../../../../audit\\log.js";
type log_Type = WithCallOpts<typeof log_handler>;
declare const log: log_Type;
export { log };


export class Client {
  private constructor();

  readonly listAudit: listAudit_Type;
  readonly log: log_Type;
}

export declare function ref(): Client;
