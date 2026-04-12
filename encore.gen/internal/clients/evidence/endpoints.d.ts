import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { createEvidence as createEvidence_handler } from "../../../../evidence\\create.js";
type createEvidence_Type = WithCallOpts<typeof createEvidence_handler>;
declare const createEvidence: createEvidence_Type;
export { createEvidence };

import { listEvidence as listEvidence_handler } from "../../../../evidence\\list.js";
type listEvidence_Type = WithCallOpts<typeof listEvidence_handler>;
declare const listEvidence: listEvidence_Type;
export { listEvidence };


export class Client {
  private constructor();

  readonly createEvidence: createEvidence_Type;
  readonly listEvidence: listEvidence_Type;
}

export declare function ref(): Client;
