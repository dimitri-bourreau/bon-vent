"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { updateCompany } from "@/features/companies/services/update-company.service";
import type { UpdateCompanyDTO } from "@/features/companies/types/update-company-dto.type";

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateCompanyDTO) => updateCompany(companyApiAdapter, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}
