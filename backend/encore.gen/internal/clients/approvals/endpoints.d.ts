import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { createApproval as createApproval_handler } from "../../../../approvals\\create.js";
type createApproval_Type = WithCallOpts<typeof createApproval_handler>;
declare const createApproval: createApproval_Type;
export { createApproval };

import { listApprovals as listApprovals_handler } from "../../../../approvals\\list.js";
type listApprovals_Type = WithCallOpts<typeof listApprovals_handler>;
declare const listApprovals: listApprovals_Type;
export { listApprovals };


export class Client {
  private constructor();

  readonly createApproval: createApproval_Type;
  readonly listApprovals: listApprovals_Type;
}

export declare function ref(): Client;
