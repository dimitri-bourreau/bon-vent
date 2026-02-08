"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { objectiveApiAdapter } from "@/features/objectives/api/api.adapter";
import { incrementObjective } from "@/features/objectives/services/increment-objective.service";
import type { ObjectiveType } from "@/features/objectives/types/objective-type.type";

export function useIncrementObjective() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (type: ObjectiveType) => incrementObjective(objectiveApiAdapter, type),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["objectives"] }),
  });
}
