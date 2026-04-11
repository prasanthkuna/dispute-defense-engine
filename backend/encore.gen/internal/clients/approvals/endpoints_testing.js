import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as approvals_service from "../../../../approvals\\encore.service";

export async function createApproval(params, opts) {
    const handler = (await import("../../../../approvals\\create")).createApproval;
    registerTestHandler({
        apiRoute: { service: "approvals", name: "createApproval", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: approvals_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("approvals", "createApproval", params, opts);
}

export async function listApprovals(params, opts) {
    const handler = (await import("../../../../approvals\\list")).listApprovals;
    registerTestHandler({
        apiRoute: { service: "approvals", name: "listApprovals", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: approvals_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("approvals", "listApprovals", params, opts);
}

