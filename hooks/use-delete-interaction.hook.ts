"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { interactionApiAdapter } from "@/features/interactions/api/api.adapter";
import { deleteInteraction } from "@/features/interactions/services/delete-interaction.service";

export function useDeleteInteraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInteraction(interactionApiAdapter, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
      queryClient.invalidateQueries({ queryKey: ["objectives"] });
    },
  });
}
