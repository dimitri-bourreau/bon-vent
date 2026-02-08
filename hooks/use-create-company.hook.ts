"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { createCompany } from "@/features/companies/services/create-company.service";
import type { CreateCompanyDTO } from "@/features/companies/types/create-company-dto.type";

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCompanyDTO) => createCompany(companyApiAdapter, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}
