"use client";

import { useQuery } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { getWaiting } from "@/features/companies/services/get-waiting.service";

export function useWaiting() {
  return useQuery({
    queryKey: ["companies", "waiting"],
    queryFn: () => getWaiting(companyApiAdapter),
  });
}
