import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as drafts_service from "../../../../drafts\\encore.service";

export async function createDraft(params, opts) {
    const handler = (await import("../../../../drafts\\create")).createDraft;
    registerTestHandler({
        apiRoute: { service: "drafts", name: "createDraft", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: drafts_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("drafts", "createDraft", params, opts);
}

export async function listDrafts(params, opts) {
    const handler = (await import("../../../../drafts\\list")).listDrafts;
    registerTestHandler({
        apiRoute: { service: "drafts", name: "listDrafts", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: drafts_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("drafts", "listDrafts", params, opts);
}

export async function updateDraft(params, opts) {
    const handler = (await import("../../../../drafts\\update")).updateDraft;
    registerTestHandler({
        apiRoute: { service: "drafts", name: "updateDraft", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: drafts_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("drafts", "updateDraft", params, opts);
}

