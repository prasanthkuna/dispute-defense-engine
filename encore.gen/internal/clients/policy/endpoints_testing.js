import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as policy_service from "../../../../policy\\encore.service";

export async function evaluate(params, opts) {
    const handler = (await import("../../../../policy\\evaluate")).evaluate;
    registerTestHandler({
        apiRoute: { service: "policy", name: "evaluate", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: policy_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("policy", "evaluate", params, opts);
}

export async function getDecisions(params, opts) {
    const handler = (await import("../../../../policy\\get")).getDecisions;
    registerTestHandler({
        apiRoute: { service: "policy", name: "getDecisions", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: policy_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("policy", "getDecisions", params, opts);
}

