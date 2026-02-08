"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { domainApiAdapter } from "@/features/domains/api/api.adapter";
import { updateDomain } from "@/features/domains/services/update-domain.service";
import type { UpdateDomainDTO } from "@/features/domains/types/update-domain-dto.type";

export function useUpdateDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateDomainDTO) => updateDomain(domainApiAdapter, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["domains"] }),
  });
}
