import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { evaluate as evaluateImpl0 } from "../../../../../policy\\evaluate";
import { getDecisions as getDecisionsImpl1 } from "../../../../../policy\\get";
import * as policy_service from "../../../../../policy\\encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "policy",
            name:              "evaluate",
            handler:           evaluateImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: policy_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "policy",
            name:              "getDecisions",
            handler:           getDecisionsImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: policy_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
