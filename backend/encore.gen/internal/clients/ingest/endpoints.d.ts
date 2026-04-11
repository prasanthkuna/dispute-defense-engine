import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { ingestEvent as ingestEvent_handler } from "../../../../ingest\\ingest.js";
type ingestEvent_Type = WithCallOpts<typeof ingestEvent_handler>;
declare const ingestEvent: ingestEvent_Type;
export { ingestEvent };

import { list as list_handler } from "../../../../ingest\\list.js";
type list_Type = WithCallOpts<typeof list_handler>;
declare const list: list_Type;
export { list };


export class Client {
  private constructor();

  readonly ingestEvent: ingestEvent_Type;
  readonly list: list_Type;
}

export declare function ref(): Client;
