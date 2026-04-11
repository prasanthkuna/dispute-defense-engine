import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { createEvidence as createEvidenceImpl0 } from "../../../../../evidence\\create";
import { listEvidence as listEvidenceImpl1 } from "../../../../../evidence\\list";
import * as evidence_service from "../../../../../evidence\\encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "evidence",
            name:              "createEvidence",
            handler:           createEvidenceImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: evidence_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "evidence",
            name:              "listEvidence",
            handler:           listEvidenceImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: evidence_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
