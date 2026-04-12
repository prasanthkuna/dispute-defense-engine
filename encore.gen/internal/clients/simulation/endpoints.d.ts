import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { runSim as runSim_handler } from "../../../../simulation\\api.js";
type runSim_Type = WithCallOpts<typeof runSim_handler>;
declare const runSim: runSim_Type;
export { runSim };

import { reset as reset_handler } from "../../../../simulation\\reset.js";
type reset_Type = WithCallOpts<typeof reset_handler>;
declare const reset: reset_Type;
export { reset };

import { seed as seed_handler } from "../../../../simulation\\seed.js";
type seed_Type = WithCallOpts<typeof seed_handler>;
declare const seed: seed_Type;
export { seed };

import { simulate as simulate_handler } from "../../../../simulation\\simulate.js";
type simulate_Type = WithCallOpts<typeof simulate_handler>;
declare const simulate: simulate_Type;
export { simulate };


export class Client {
  private constructor();

  readonly runSim: runSim_Type;
  readonly reset: reset_Type;
  readonly seed: seed_Type;
  readonly simulate: simulate_Type;
}

export declare function ref(): Client;
