import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { getAgentRun as getAgentRunImpl0 } from "../../../../../agent\\get_run";
import { listAgentSteps as listAgentStepsImpl1 } from "../../../../../agent\\list_steps";
import { runAgent as runAgentImpl2 } from "../../../../../agent\\run";
import * as agent_service from "../../../../../agent\\encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "agent",
            name:              "getAgentRun",
            handler:           getAgentRunImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: agent_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "agent",
            name:              "listAgentSteps",
            handler:           listAgentStepsImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: agent_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "agent",
            name:              "runAgent",
            handler:           runAgentImpl2,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: agent_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
