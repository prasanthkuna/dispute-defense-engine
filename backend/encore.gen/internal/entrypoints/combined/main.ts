import { registerGateways, registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";

import { getAgentRun as agent_getAgentRunImpl0 } from "../../../../agent\\get_run";
import { listAgentSteps as agent_listAgentStepsImpl1 } from "../../../../agent\\list_steps";
import { runAgent as agent_runAgentImpl2 } from "../../../../agent\\run";
import { createApproval as approvals_createApprovalImpl3 } from "../../../../approvals\\create";
import { listApprovals as approvals_listApprovalsImpl4 } from "../../../../approvals\\list";
import { listAudit as audit_listAuditImpl5 } from "../../../../audit\\list";
import { log as audit_logImpl6 } from "../../../../audit\\log";
import { get as cases_getImpl7 } from "../../../../cases\\get";
import { list as cases_listImpl8 } from "../../../../cases\\list";
import { stats as cases_statsImpl9 } from "../../../../cases\\stats";
import { update as cases_updateImpl10 } from "../../../../cases\\update";
import { createDraft as drafts_createDraftImpl11 } from "../../../../drafts\\create";
import { listDrafts as drafts_listDraftsImpl12 } from "../../../../drafts\\list";
import { updateDraft as drafts_updateDraftImpl13 } from "../../../../drafts\\update";
import { createEvidence as evidence_createEvidenceImpl14 } from "../../../../evidence\\create";
import { listEvidence as evidence_listEvidenceImpl15 } from "../../../../evidence\\list";
import { ingestEvent as ingest_ingestEventImpl16 } from "../../../../ingest\\ingest";
import { list as ingest_listImpl17 } from "../../../../ingest\\list";
import { evaluate as policy_evaluateImpl18 } from "../../../../policy\\evaluate";
import { getDecisions as policy_getDecisionsImpl19 } from "../../../../policy\\get";
import { runSim as simulation_runSimImpl20 } from "../../../../simulation\\api";
import { reset as simulation_resetImpl21 } from "../../../../simulation\\reset";
import { seed as simulation_seedImpl22 } from "../../../../simulation\\seed";
import { simulate as simulation_simulateImpl23 } from "../../../../simulation\\simulate";
import * as audit_service from "../../../../audit\\encore.service";
import * as drafts_service from "../../../../drafts\\encore.service";
import * as evidence_service from "../../../../evidence\\encore.service";
import * as ingest_service from "../../../../ingest\\encore.service";
import * as agent_service from "../../../../agent\\encore.service";
import * as cases_service from "../../../../cases\\encore.service";
import * as policy_service from "../../../../policy\\encore.service";
import * as approvals_service from "../../../../approvals\\encore.service";
import * as frontend_service from "../../../../frontend\\encore.service";
import * as simulation_service from "../../../../simulation\\encore.service";


const gateways: any[] = [
];

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "agent",
            name:              "getAgentRun",
            handler:           agent_getAgentRunImpl0,
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
            handler:           agent_listAgentStepsImpl1,
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
            handler:           agent_runAgentImpl2,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: agent_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "approvals",
            name:              "createApproval",
            handler:           approvals_createApprovalImpl3,
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
            handler:           approvals_listApprovalsImpl4,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: approvals_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "audit",
            name:              "listAudit",
            handler:           audit_listAuditImpl5,
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
            handler:           audit_logImpl6,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: audit_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "cases",
            name:              "get",
            handler:           cases_getImpl7,
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
            handler:           cases_listImpl8,
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
            handler:           cases_statsImpl9,
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
            handler:           cases_updateImpl10,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: cases_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "drafts",
            name:              "createDraft",
            handler:           drafts_createDraftImpl11,
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
            handler:           drafts_listDraftsImpl12,
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
            handler:           drafts_updateDraftImpl13,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: drafts_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "evidence",
            name:              "createEvidence",
            handler:           evidence_createEvidenceImpl14,
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
            handler:           evidence_listEvidenceImpl15,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: evidence_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "ingest",
            name:              "ingestEvent",
            handler:           ingest_ingestEventImpl16,
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
            handler:           ingest_listImpl17,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: ingest_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "policy",
            name:              "evaluate",
            handler:           policy_evaluateImpl18,
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
            handler:           policy_getDecisionsImpl19,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: policy_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "simulation",
            name:              "runSim",
            handler:           simulation_runSimImpl20,
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
            handler:           simulation_resetImpl21,
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
            handler:           simulation_seedImpl22,
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
            handler:           simulation_simulateImpl23,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: simulation_service.default.cfg.middlewares || [],
    },
];

registerGateways(gateways);
registerHandlers(handlers);

await run(import.meta.url);
