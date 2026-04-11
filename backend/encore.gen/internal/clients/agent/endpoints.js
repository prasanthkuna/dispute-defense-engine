import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";

const TEST_ENDPOINTS = typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test"
    ? await import("./endpoints_testing.js")
    : null;

export async function getAgentRun(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.getAgentRun(params, opts);
    }

    return apiCall("agent", "getAgentRun", params, opts);
}
export async function listAgentSteps(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.listAgentSteps(params, opts);
    }

    return apiCall("agent", "listAgentSteps", params, opts);
}
export async function runAgent(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.runAgent(params, opts);
    }

    return apiCall("agent", "runAgent", params, opts);
}

export class Client {
  constructor() {
    this.getAgentRun = getAgentRun;
    this.listAgentSteps = listAgentSteps;
    this.runAgent = runAgent;
  }
}

let _client_instance;

export function ref() {
  if (!_client_instance) {
    _client_instance = new Client();
  }
  return _client_instance;
}
