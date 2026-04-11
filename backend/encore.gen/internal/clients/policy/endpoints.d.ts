import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { evaluate as evaluate_handler } from "../../../../policy\\evaluate.js";
type evaluate_Type = WithCallOpts<typeof evaluate_handler>;
declare const evaluate: evaluate_Type;
export { evaluate };

import { getDecisions as getDecisions_handler } from "../../../../policy\\get.js";
type getDecisions_Type = WithCallOpts<typeof getDecisions_handler>;
declare const getDecisions: getDecisions_Type;
export { getDecisions };


export class Client {
  private constructor();

  readonly evaluate: evaluate_Type;
  readonly getDecisions: getDecisions_Type;
}

export declare function ref(): Client;
