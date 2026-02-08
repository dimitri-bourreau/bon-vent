"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApiAdapter } from "@/features/categories/api/api.adapter";
import { createCategory } from "@/features/categories/services/create-category.service";
import type { CreateCategoryDTO } from "@/features/categories/types/create-category-dto.type";

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCategoryDTO) => createCategory(categoryApiAdapter, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}
