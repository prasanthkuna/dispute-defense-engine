import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { listAudit as listAuditImpl0 } from "../../../../../audit\\list";
import { log as logImpl1 } from "../../../../../audit\\log";
import * as audit_service from "../../../../../audit\\encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "audit",
            name:              "listAudit",
            handler:           listAuditImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: audit_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "audit",
            name:              "log",
            handler:           logImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: audit_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
