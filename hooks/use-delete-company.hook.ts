"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { deleteCompany } from "@/features/companies/services/delete-company.service";

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCompany(companyApiAdapter, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}
