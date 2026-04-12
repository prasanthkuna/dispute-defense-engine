import { useQuery } from "@tanstack/react-query";
import type { Case, CaseStats } from "~backend/cases/types";
import { fetchApi } from "../lib/api";

interface CasesFilter {
  status?: string;
  recommendation?: string;
  scenario_type?: string;
  reason_code?: string;
  phase?: string;
  sla_bucket?: string;
}

export function useCases(filters: CasesFilter = {}) {
  return useQuery({
    queryKey: ["cases", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters.status) params.status = filters.status;
      if (filters.recommendation) params.recommendation = filters.recommendation;
      if (filters.scenario_type) params.scenario_type = filters.scenario_type;
      if (filters.reason_code) params.reason_code = filters.reason_code;
      if (filters.phase) params.phase = filters.phase;
      if (filters.sla_bucket) params.sla_bucket = filters.sla_bucket;
      const res = await fetchApi<{ cases: Case[] }>("/cases", params);
      return res.cases;
    },
  });
}

export function useCaseStats() {
  return useQuery({
    queryKey: ["cases", "stats"],
    queryFn: async () => fetchApi<CaseStats>("/cases/stats"),
    refetchInterval: 10000,
  });
}
