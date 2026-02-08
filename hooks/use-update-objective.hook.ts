"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { objectiveApiAdapter } from "@/features/objectives/api/api.adapter";
import { updateObjective } from "@/features/objectives/services/update-objective.service";
import type { UpdateObjectiveDTO } from "@/features/objectives/types/update-objective-dto.type";

export function useUpdateObjective() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateObjectiveDTO) => updateObjective(objectiveApiAdapter, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["objectives"] }),
  });
}
