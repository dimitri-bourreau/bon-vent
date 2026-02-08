"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { interactionApiAdapter } from "@/features/interactions/api/api.adapter";
import { createInteraction } from "@/features/interactions/services/create-interaction.service";
import type { CreateInteractionDTO } from "@/features/interactions/types/create-interaction-dto.type";

export function useCreateInteraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateInteractionDTO) =>
      createInteraction(interactionApiAdapter, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
      queryClient.invalidateQueries({ queryKey: ["objectives"] });
    },
  });
}
