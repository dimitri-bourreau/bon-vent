"use client";

import { useQuery } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { getCompanyById } from "@/features/companies/services/get-company-by-id.service";

export function useCompany(id: string | undefined) {
  return useQuery({
    queryKey: ["companies", "byId", id],
    queryFn: () => getCompanyById(companyApiAdapter, id!),
    enabled: !!id,
  });
}
