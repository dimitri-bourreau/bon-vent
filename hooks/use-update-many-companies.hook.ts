"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { updateManyCompanies } from "@/features/companies/services/update-many-companies.service";
import type { BulkUpdateDTO } from "@/features/companies/types/bulk-update-dto.type";

export const useUpdateManyCompanies = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: BulkUpdateDTO) =>
      updateManyCompanies(companyApiAdapter, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
};
