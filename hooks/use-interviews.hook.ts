"use client";

import { useQuery } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { getInterviews } from "@/features/companies/services/get-interviews.service";

export function useInterviews() {
  return useQuery({
    queryKey: ["companies", "interviews"],
    queryFn: () => getInterviews(companyApiAdapter),
  });
}
