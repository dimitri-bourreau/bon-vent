"use client";

import { useQuery } from "@tanstack/react-query";
import { interactionApiAdapter } from "@/features/interactions/api/api.adapter";
import { getThisWeekInteractions } from "@/features/interactions/services/get-this-week-interactions.service";

export function useThisWeekInteractions() {
  return useQuery({
    queryKey: ["interactions", "week"],
    queryFn: () => getThisWeekInteractions(interactionApiAdapter),
  });
}
