import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { ingestEvent as ingestEventImpl0 } from "../../../../../ingest\\ingest";
import { list as listImpl1 } from "../../../../../ingest\\list";
import * as ingest_service from "../../../../../ingest\\encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "ingest",
            name:              "ingestEvent",
            handler:           ingestEventImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: ingest_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "ingest",
            name:              "list",
            handler:           listImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: ingest_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
