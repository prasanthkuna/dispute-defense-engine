import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as agent_service from "../../../../agent\\encore.service";

export async function getAgentRun(params, opts) {
    const handler = (await import("../../../../agent\\get_run")).getAgentRun;
    registerTestHandler({
        apiRoute: { service: "agent", name: "getAgentRun", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: agent_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("agent", "getAgentRun", params, opts);
}

export async function listAgentSteps(params, opts) {
    const handler = (await import("../../../../agent\\list_steps")).listAgentSteps;
    registerTestHandler({
        apiRoute: { service: "agent", name: "listAgentSteps", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: agent_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("agent", "listAgentSteps", params, opts);
}

export async function runAgent(params, opts) {
    const handler = (await import("../../../../agent\\run")).runAgent;
    registerTestHandler({
        apiRoute: { service: "agent", name: "runAgent", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: agent_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("agent", "runAgent", params, opts);
}

