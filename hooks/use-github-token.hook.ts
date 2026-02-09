"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { githubApiAdapter } from "@/features/github/api/api.adapter";

export function useGithubToken() {
  return useQuery({
    queryKey: ["github-token"],
    queryFn: () => githubApiAdapter.getToken(),
  });
}

export function useSetGithubToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => githubApiAdapter.setToken(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-token"] });
      queryClient.invalidateQueries({ queryKey: ["github-issues"] });
    },
  });
}
