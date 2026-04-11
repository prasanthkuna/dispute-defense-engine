import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";

const TEST_ENDPOINTS = typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test"
    ? await import("./endpoints_testing.js")
    : null;

export async function runSim(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.runSim(params, opts);
    }

    return apiCall("simulation", "runSim", params, opts);
}
export async function reset(opts) {
    const params = undefined;
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.reset(params, opts);
    }

    return apiCall("simulation", "reset", params, opts);
}
export async function seed(opts) {
    const params = undefined;
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.seed(params, opts);
    }

    return apiCall("simulation", "seed", params, opts);
}
export async function simulate(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        return TEST_ENDPOINTS.simulate(params, opts);
    }

    return apiCall("simulation", "simulate", params, opts);
}

export class Client {
  constructor() {
    this.runSim = runSim;
    this.reset = reset;
    this.seed = seed;
    this.simulate = simulate;
  }
}

let _client_instance;

export function ref() {
  if (!_client_instance) {
    _client_instance = new Client();
  }
  return _client_instance;
}
