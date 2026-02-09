"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { githubApiAdapter } from "@/features/github/api/api.adapter";
import { removeGithubRepo } from "@/features/github/services/remove-repo.service";

export function useRemoveGithubRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeGithubRepo(githubApiAdapter, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-repos"] });
      queryClient.invalidateQueries({ queryKey: ["github-issues"] });
    },
  });
}
