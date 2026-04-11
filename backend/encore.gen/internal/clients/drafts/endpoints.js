import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";

const TEST_ENDPOINTS = typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test"
    ? await import("./endpoints_testing.js")
    : null;

export async function createDraft(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.createDraft(params, opts);
    }

    return apiCall("drafts", "createDraft", params, opts);
}
export async function listDrafts(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.listDrafts(params, opts);
    }

    return apiCall("drafts", "listDrafts", params, opts);
}
export async function updateDraft(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.updateDraft(params, opts);
    }

    return apiCall("drafts", "updateDraft", params, opts);
}

export class Client {
  constructor() {
    this.createDraft = createDraft;
    this.listDrafts = listDrafts;
    this.updateDraft = updateDraft;
  }
}

let _client_instance;

export function ref() {
  if (!_client_instance) {
    _client_instance = new Client();
  }
  return _client_instance;
}
