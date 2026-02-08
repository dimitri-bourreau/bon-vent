"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApiAdapter } from "@/features/categories/api/api.adapter";
import { getAllCategories } from "@/features/categories/services/get-all-categories.service";

const KEYS = {
  all: ["categories"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: () => getAllCategories(categoryApiAdapter),
  });
}

export function useCategoriesQueryKey() {
  return KEYS.all;
}

export function useInvalidateCategories() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: KEYS.all });
}
