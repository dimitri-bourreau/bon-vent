"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { updateApplicationStage } from "@/features/companies/services/update-application-stage.service";
import type { ApplicationStage } from "@/features/companies/types/application-stage.type";

export function useUpdateApplicationStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: ApplicationStage }) =>
      updateApplicationStage(companyApiAdapter, id, stage),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}
