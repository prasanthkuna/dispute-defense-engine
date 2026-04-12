import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";

const TEST_ENDPOINTS = typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test"
    ? await import("./endpoints_testing.js")
    : null;

export async function listAudit(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.listAudit(params, opts);
    }

    return apiCall("audit", "listAudit", params, opts);
}
export async function log(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.log(params, opts);
    }

    return apiCall("audit", "log", params, opts);
}

export class Client {
  constructor() {
    this.listAudit = listAudit;
    this.log = log;
  }
}

let _client_instance;

export function ref() {
  if (!_client_instance) {
    _client_instance = new Client();
  }
  return _client_instance;
}
