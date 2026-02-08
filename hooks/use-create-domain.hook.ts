"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { domainApiAdapter } from "@/features/domains/api/api.adapter";
import { createDomain } from "@/features/domains/services/create-domain.service";
import type { CreateDomainDTO } from "@/features/domains/types/create-domain-dto.type";

export function useCreateDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDomainDTO) => createDomain(domainApiAdapter, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["domains"] }),
  });
}
