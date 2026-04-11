import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { get as getImpl0 } from "../../../../../cases\\get";
import { list as listImpl1 } from "../../../../../cases\\list";
import { stats as statsImpl2 } from "../../../../../cases\\stats";
import { update as updateImpl3 } from "../../../../../cases\\update";
import * as cases_service from "../../../../../cases\\encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "cases",
            name:              "get",
            handler:           getImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: cases_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "cases",
            name:              "list",
            handler:           listImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: cases_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "cases",
            name:              "stats",
            handler:           statsImpl2,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: cases_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "cases",
            name:              "update",
            handler:           updateImpl3,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: cases_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
