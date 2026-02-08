"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zoneAdapter } from "../adapters/zone.adapter";
import { createZoneService } from "../services/zone.service";
import type { CreateZoneDTO, UpdateZoneDTO } from "../domain/types";

const service = createZoneService(zoneAdapter);

const KEYS = {
  all: ["zones"] as const,
};

export function useZones() {
  return useQuery({ queryKey: KEYS.all, queryFn: service.getAll });
}

export function useCreateZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateZoneDTO) => service.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateZoneDTO) => service.update(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}
