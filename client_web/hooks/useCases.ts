import { useQuery } from "@tanstack/react-query";
import backend from "~backend/client";

interface CasesFilter {
  status?: string;
  recommendation?: string;
  scenario_type?: string;
}

export function useCases(filters: CasesFilter = {}) {
  return useQuery({
    queryKey: ["cases", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters.status) params.status = filters.status;
      if (filters.recommendation) params.recommendation = filters.recommendation;
      if (filters.scenario_type) params.scenario_type = filters.scenario_type;
      const res = await backend.cases.list(params);
      return res.cases;
    },
  });
}

export function useCaseStats() {
  return useQuery({
    queryKey: ["cases", "stats"],
    queryFn: async () => backend.cases.stats(),
    refetchInterval: 10000,
  });
}
