"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { githubApiAdapter } from "@/features/github/api/api.adapter";
import { addGithubRepo } from "@/features/github/services/add-repo.service";
import type { CreateGithubRepoDTO } from "@/features/github/types/create-repo-dto.type";

export function useAddGithubRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateGithubRepoDTO) =>
      addGithubRepo(githubApiAdapter, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-repos"] });
      queryClient.invalidateQueries({ queryKey: ["github-issues"] });
    },
  });
}
