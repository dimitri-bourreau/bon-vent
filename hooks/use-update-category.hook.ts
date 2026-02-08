"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApiAdapter } from "@/features/categories/api/api.adapter";
import { updateCategory } from "@/features/categories/services/update-category.service";
import type { UpdateCategoryDTO } from "@/features/categories/types/update-category-dto.type";

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateCategoryDTO) => updateCategory(categoryApiAdapter, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}
