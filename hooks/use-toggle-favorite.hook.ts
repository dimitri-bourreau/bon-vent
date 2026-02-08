"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { toggleFavorite } from "@/features/companies/services/toggle-favorite.service";

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleFavorite(companyApiAdapter, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}
