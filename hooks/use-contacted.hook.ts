"use client";

import { useQuery } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { getContacted } from "@/features/companies/services/get-contacted.service";

export function useContacted() {
  return useQuery({
    queryKey: ["companies", "contacted"],
    queryFn: () => getContacted(companyApiAdapter),
  });
}
