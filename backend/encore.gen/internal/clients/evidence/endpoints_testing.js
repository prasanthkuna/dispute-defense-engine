import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as evidence_service from "../../../../evidence\\encore.service";

export async function createEvidence(params, opts) {
    const handler = (await import("../../../../evidence\\create")).createEvidence;
    registerTestHandler({
        apiRoute: { service: "evidence", name: "createEvidence", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: evidence_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("evidence", "createEvidence", params, opts);
}

export async function listEvidence(params, opts) {
    const handler = (await import("../../../../evidence\\list")).listEvidence;
    registerTestHandler({
        apiRoute: { service: "evidence", name: "listEvidence", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: evidence_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("evidence", "listEvidence", params, opts);
}

