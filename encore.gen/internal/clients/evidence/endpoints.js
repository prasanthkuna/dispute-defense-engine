import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";

const TEST_ENDPOINTS = typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test"
    ? await import("./endpoints_testing.js")
    : null;

export async function createEvidence(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.createEvidence(params, opts);
    }

    return apiCall("evidence", "createEvidence", params, opts);
}
export async function listEvidence(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.listEvidence(params, opts);
    }

    return apiCall("evidence", "listEvidence", params, opts);
}

export class Client {
  constructor() {
    this.createEvidence = createEvidence;
    this.listEvidence = listEvidence;
  }
}

let _client_instance;

export function ref() {
  if (!_client_instance) {
    _client_instance = new Client();
  }
  return _client_instance;
}
