import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as simulation_service from "../../../../simulation\\encore.service";

export async function runSim(params, opts) {
    const handler = (await import("../../../../simulation\\api")).runSim;
    registerTestHandler({
        apiRoute: { service: "simulation", name: "runSim", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: simulation_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("simulation", "runSim", params, opts);
}

export async function reset(params, opts) {
    const handler = (await import("../../../../simulation\\reset")).reset;
    registerTestHandler({
        apiRoute: { service: "simulation", name: "reset", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: simulation_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("simulation", "reset", params, opts);
}

export async function seed(params, opts) {
    const handler = (await import("../../../../simulation\\seed")).seed;
    registerTestHandler({
        apiRoute: { service: "simulation", name: "seed", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: simulation_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("simulation", "seed", params, opts);
}

export async function simulate(params, opts) {
    const handler = (await import("../../../../simulation\\simulate")).simulate;
    registerTestHandler({
        apiRoute: { service: "simulation", name: "simulate", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: simulation_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("simulation", "simulate", params, opts);
}

