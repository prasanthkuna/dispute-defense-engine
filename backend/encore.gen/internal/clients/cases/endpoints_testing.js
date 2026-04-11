import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as cases_service from "../../../../cases\\encore.service";

export async function get(params, opts) {
    const handler = (await import("../../../../cases\\get")).get;
    registerTestHandler({
        apiRoute: { service: "cases", name: "get", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: cases_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("cases", "get", params, opts);
}

export async function list(params, opts) {
    const handler = (await import("../../../../cases\\list")).list;
    registerTestHandler({
        apiRoute: { service: "cases", name: "list", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: cases_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("cases", "list", params, opts);
}

export async function stats(params, opts) {
    const handler = (await import("../../../../cases\\stats")).stats;
    registerTestHandler({
        apiRoute: { service: "cases", name: "stats", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: cases_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("cases", "stats", params, opts);
}

export async function update(params, opts) {
    const handler = (await import("../../../../cases\\update")).update;
    registerTestHandler({
        apiRoute: { service: "cases", name: "update", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: cases_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("cases", "update", params, opts);
}

