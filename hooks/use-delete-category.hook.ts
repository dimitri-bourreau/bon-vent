"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApiAdapter } from "@/features/categories/api/api.adapter";
import { deleteCategory } from "@/features/categories/services/delete-category.service";

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(categoryApiAdapter, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}
