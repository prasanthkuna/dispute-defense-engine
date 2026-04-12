import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as audit_service from "../../../../audit\\encore.service";

export async function listAudit(params, opts) {
    const handler = (await import("../../../../audit\\list")).listAudit;
    registerTestHandler({
        apiRoute: { service: "audit", name: "listAudit", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: audit_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("audit", "listAudit", params, opts);
}

export async function log(params, opts) {
    const handler = (await import("../../../../audit\\log")).log;
    registerTestHandler({
        apiRoute: { service: "audit", name: "log", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: audit_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("audit", "log", params, opts);
}

