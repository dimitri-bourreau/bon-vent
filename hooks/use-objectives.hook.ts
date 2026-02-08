"use client";

import { useQuery } from "@tanstack/react-query";
import { objectiveApiAdapter } from "@/features/objectives/api/api.adapter";
import { getCurrentWeekObjectives } from "@/features/objectives/services/get-current-week-objectives.service";

export function useObjectives() {
  return useQuery({
    queryKey: ["objectives"],
    queryFn: () => getCurrentWeekObjectives(objectiveApiAdapter),
  });
}
