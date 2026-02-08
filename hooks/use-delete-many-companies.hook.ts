"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { deleteManyCompanies } from "@/features/companies/services/delete-many-companies.service";

export function useDeleteManyCompanies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => deleteManyCompanies(companyApiAdapter, ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}
