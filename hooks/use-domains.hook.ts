"use client";

import { useQuery } from "@tanstack/react-query";
import { domainApiAdapter } from "@/features/domains/api/api.adapter";
import { getAllDomains } from "@/features/domains/services/get-all-domains.service";

export function useDomains() {
  return useQuery({
    queryKey: ["domains"],
    queryFn: () => getAllDomains(domainApiAdapter),
  });
}
