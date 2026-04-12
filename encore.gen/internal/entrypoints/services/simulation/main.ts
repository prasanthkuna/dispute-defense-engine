import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { runSim as runSimImpl0 } from "../../../../../simulation\\api";
import { reset as resetImpl1 } from "../../../../../simulation\\reset";
import { seed as seedImpl2 } from "../../../../../simulation\\seed";
import { simulate as simulateImpl3 } from "../../../../../simulation\\simulate";
import * as simulation_service from "../../../../../simulation\\encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "simulation",
            name:              "runSim",
            handler:           runSimImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: simulation_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "simulation",
            name:              "reset",
            handler:           resetImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: simulation_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "simulation",
            name:              "seed",
            handler:           seedImpl2,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: simulation_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "simulation",
            name:              "simulate",
            handler:           simulateImpl3,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: simulation_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
