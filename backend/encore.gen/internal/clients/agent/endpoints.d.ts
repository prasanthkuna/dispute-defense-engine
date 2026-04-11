import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { getAgentRun as getAgentRun_handler } from "../../../../agent\\get_run.js";
type getAgentRun_Type = WithCallOpts<typeof getAgentRun_handler>;
declare const getAgentRun: getAgentRun_Type;
export { getAgentRun };

import { listAgentSteps as listAgentSteps_handler } from "../../../../agent\\list_steps.js";
type listAgentSteps_Type = WithCallOpts<typeof listAgentSteps_handler>;
declare const listAgentSteps: listAgentSteps_Type;
export { listAgentSteps };

import { runAgent as runAgent_handler } from "../../../../agent\\run.js";
type runAgent_Type = WithCallOpts<typeof runAgent_handler>;
declare const runAgent: runAgent_Type;
export { runAgent };


export class Client {
  private constructor();

  readonly getAgentRun: getAgentRun_Type;
  readonly listAgentSteps: listAgentSteps_Type;
  readonly runAgent: runAgent_Type;
}

export declare function ref(): Client;
