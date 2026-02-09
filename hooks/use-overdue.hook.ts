"use client";

import { useQuery } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { getOverdue } from "@/features/companies/services/get-overdue.service";

export function useOverdue(days = 7) {
  return useQuery({
    queryKey: ["companies", "overdue", days],
    queryFn: () => getOverdue(companyApiAdapter, days),
  });
}
