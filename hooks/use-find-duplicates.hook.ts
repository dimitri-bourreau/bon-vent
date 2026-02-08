"use client";

import { useQuery } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { findDuplicates } from "@/features/companies/services/find-duplicates.service";

export function useFindDuplicates(name: string) {
  return useQuery({
    queryKey: ["companies", "duplicates", name],
    queryFn: () => findDuplicates(companyApiAdapter, name),
    enabled: name.length >= 2,
  });
}
