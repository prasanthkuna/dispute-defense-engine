import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { get as get_handler } from "../../../../cases\\get.js";
type get_Type = WithCallOpts<typeof get_handler>;
declare const get: get_Type;
export { get };

import { list as list_handler } from "../../../../cases\\list.js";
type list_Type = WithCallOpts<typeof list_handler>;
declare const list: list_Type;
export { list };

import { stats as stats_handler } from "../../../../cases\\stats.js";
type stats_Type = WithCallOpts<typeof stats_handler>;
declare const stats: stats_Type;
export { stats };

import { update as update_handler } from "../../../../cases\\update.js";
type update_Type = WithCallOpts<typeof update_handler>;
declare const update: update_Type;
export { update };


export class Client {
  private constructor();

  readonly get: get_Type;
  readonly list: list_Type;
  readonly stats: stats_Type;
  readonly update: update_Type;
}

export declare function ref(): Client;
