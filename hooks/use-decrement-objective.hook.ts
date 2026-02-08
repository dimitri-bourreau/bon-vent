"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { objectiveApiAdapter } from "@/features/objectives/api/api.adapter";
import { decrementObjective } from "@/features/objectives/services/decrement-objective.service";
import type { ObjectiveType } from "@/features/objectives/types/objective-type.type";

export function useDecrementObjective() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (type: ObjectiveType) => decrementObjective(objectiveApiAdapter, type),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["objectives"] }),
  });
}
