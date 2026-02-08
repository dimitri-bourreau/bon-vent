"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { domainAdapter } from "../adapters/domain.adapter";
import { createDomainService } from "../services/domain.service";
import type { CreateDomainDTO, UpdateDomainDTO } from "../domain/types";

const service = createDomainService(domainAdapter);

const KEYS = {
  all: ["domains"] as const,
};

export function useDomains() {
  return useQuery({ queryKey: KEYS.all, queryFn: service.getAll });
}

export function useCreateDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDomainDTO) => service.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateDomainDTO) => service.update(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}
