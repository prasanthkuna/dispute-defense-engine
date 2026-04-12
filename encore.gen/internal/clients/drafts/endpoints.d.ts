import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { createDraft as createDraft_handler } from "../../../../drafts\\create.js";
type createDraft_Type = WithCallOpts<typeof createDraft_handler>;
declare const createDraft: createDraft_Type;
export { createDraft };

import { listDrafts as listDrafts_handler } from "../../../../drafts\\list.js";
type listDrafts_Type = WithCallOpts<typeof listDrafts_handler>;
declare const listDrafts: listDrafts_Type;
export { listDrafts };

import { updateDraft as updateDraft_handler } from "../../../../drafts\\update.js";
type updateDraft_Type = WithCallOpts<typeof updateDraft_handler>;
declare const updateDraft: updateDraft_Type;
export { updateDraft };


export class Client {
  private constructor();

  readonly createDraft: createDraft_Type;
  readonly listDrafts: listDrafts_Type;
  readonly updateDraft: updateDraft_Type;
}

export declare function ref(): Client;
