"use client";

import { useQuery } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { getAwaitingResponse } from "@/features/companies/services/get-awaiting-response.service";

export function useAwaitingResponse() {
  return useQuery({
    queryKey: ["companies", "awaiting-response"],
    queryFn: () => getAwaitingResponse(companyApiAdapter),
  });
}
