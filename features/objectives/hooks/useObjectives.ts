"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { objectiveAdapter } from "../adapters/objective.adapter";
import { createObjectiveService } from "../services/objective.service";
import type { ObjectiveType, UpdateObjectiveDTO } from "../domain/types";

const service = createObjectiveService(objectiveAdapter);

const KEYS = {
  all: ["objectives"] as const,
  currentWeek: ["objectives", "current-week"] as const,
};

export function useObjectives() {
  return useQuery({
    queryKey: KEYS.currentWeek,
    queryFn: async () => {
      await service.resetWeek();
      return service.getCurrentWeek();
    },
  });
}

export function useIncrementObjective() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (type: ObjectiveType) => service.increment(type),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: KEYS.currentWeek }),
  });
}

export function useDecrementObjective() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (type: ObjectiveType) => service.decrement(type),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: KEYS.currentWeek }),
  });
}

export function useUpdateObjective() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateObjectiveDTO) => service.update(dto),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: KEYS.currentWeek }),
  });
}
