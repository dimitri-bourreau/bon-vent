"use client";

import { useQuery } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { getAllCompanies } from "@/features/companies/services/get-all-companies.service";

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => getAllCompanies(companyApiAdapter),
  });
}
