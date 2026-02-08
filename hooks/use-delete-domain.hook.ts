"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { domainApiAdapter } from "@/features/domains/api/api.adapter";
import { deleteDomain } from "@/features/domains/services/delete-domain.service";

export function useDeleteDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDomain(domainApiAdapter, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["domains"] }),
  });
}
