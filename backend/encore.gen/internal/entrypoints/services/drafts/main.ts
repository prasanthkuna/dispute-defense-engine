import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { createDraft as createDraftImpl0 } from "../../../../../drafts\\create";
import { listDrafts as listDraftsImpl1 } from "../../../../../drafts\\list";
import { updateDraft as updateDraftImpl2 } from "../../../../../drafts\\update";
import * as drafts_service from "../../../../../drafts\\encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "drafts",
            name:              "createDraft",
            handler:           createDraftImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: drafts_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "drafts",
            name:              "listDrafts",
            handler:           listDraftsImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: drafts_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "drafts",
            name:              "updateDraft",
            handler:           updateDraftImpl2,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: drafts_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
