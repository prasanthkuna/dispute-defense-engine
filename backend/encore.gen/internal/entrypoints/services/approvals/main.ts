import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { createApproval as createApprovalImpl0 } from "../../../../../approvals\\create";
import { listApprovals as listApprovalsImpl1 } from "../../../../../approvals\\list";
import * as approvals_service from "../../../../../approvals\\encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "approvals",
            name:              "createApproval",
            handler:           createApprovalImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: approvals_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "approvals",
            name:              "listApprovals",
            handler:           listApprovalsImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: approvals_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
