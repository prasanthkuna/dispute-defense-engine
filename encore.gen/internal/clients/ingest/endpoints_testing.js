import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as ingest_service from "../../../../ingest\\encore.service";

export async function ingestEvent(params, opts) {
    const handler = (await import("../../../../ingest\\ingest")).ingestEvent;
    registerTestHandler({
        apiRoute: { service: "ingest", name: "ingestEvent", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: ingest_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("ingest", "ingestEvent", params, opts);
}

export async function list(params, opts) {
    const handler = (await import("../../../../ingest\\list")).list;
    registerTestHandler({
        apiRoute: { service: "ingest", name: "list", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: ingest_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("ingest", "list", params, opts);
}

