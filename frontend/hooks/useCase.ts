import { useQuery } from "@tanstack/react-query";
import backend from "~backend/client";

export function useCase(id: string) {
  return useQuery({
    queryKey: ["case", id],
    queryFn: () => backend.cases.get({ id }),
    enabled: !!id,
  });
}

export function useCaseEvidence(caseId: string) {
  return useQuery({
    queryKey: ["evidence", caseId],
    queryFn: () => backend.evidence.listEvidence({ case_id: caseId }),
    enabled: !!caseId,
  });
}

export function useCaseAgentSteps(caseId: string) {
  return useQuery({
    queryKey: ["agent-steps", caseId],
    queryFn: () => backend.agent.listAgentSteps({ case_id: caseId }),
    enabled: !!caseId,
  });
}

export function useCasePolicyDecisions(caseId: string) {
  return useQuery({
    queryKey: ["policy", caseId],
    queryFn: () => backend.policy.getDecisions({ case_id: caseId }),
    enabled: !!caseId,
  });
}

export function useCaseDrafts(caseId: string) {
  return useQuery({
    queryKey: ["drafts", caseId],
    queryFn: () => backend.drafts.listDrafts({ case_id: caseId }),
    enabled: !!caseId,
  });
}

export function useCaseApprovals(caseId: string) {
  return useQuery({
    queryKey: ["approvals", caseId],
    queryFn: () => backend.approvals.listApprovals({ case_id: caseId }),
    enabled: !!caseId,
  });
}

export function useCaseAuditLogs(caseId: string) {
  return useQuery({
    queryKey: ["audit", caseId],
    queryFn: () => backend.audit.listAudit({ case_id: caseId }),
    enabled: !!caseId,
  });
}
