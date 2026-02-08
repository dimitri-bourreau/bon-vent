"use client";

import { useQuery } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { searchCompanies } from "@/features/companies/services/search-companies.service";

export function useSearchCompanies(query: string) {
  return useQuery({
    queryKey: ["companies", "search", query],
    queryFn: () => searchCompanies(companyApiAdapter, query),
    enabled: query.length >= 2,
  });
}
