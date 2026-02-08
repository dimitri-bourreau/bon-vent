"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { interactionAdapter } from "../adapters/interaction.adapter";
import { createInteractionService } from "../services/interaction.service";
import type { CreateInteractionDTO } from "../domain/types";

const service = createInteractionService(interactionAdapter);

const KEYS = {
  all: ["interactions"] as const,
  thisWeek: ["interactions", "this-week"] as const,
};

export function useInteractions() {
  return useQuery({ queryKey: KEYS.all, queryFn: service.getAll });
}

export function useThisWeekInteractions() {
  return useQuery({ queryKey: KEYS.thisWeek, queryFn: service.getThisWeek });
}

export function useCreateInteraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateInteractionDTO) => service.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["objectives"] });
    },
  });
}

export function useDeleteInteraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all }),
  });
}
