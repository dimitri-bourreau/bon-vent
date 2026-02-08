"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApiAdapter } from "@/features/companies/api/api.adapter";
import { addTimelineEvent } from "@/features/companies/services/add-timeline-event.service";
import type { AddTimelineEventDTO } from "@/features/companies/types/add-timeline-event-dto.type";

export function useAddTimelineEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddTimelineEventDTO) => addTimelineEvent(companyApiAdapter, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}
