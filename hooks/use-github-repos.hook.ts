"use client";

import { useQuery } from "@tanstack/react-query";
import { githubApiAdapter } from "@/features/github/api/api.adapter";
import { getGithubRepos } from "@/features/github/services/get-repos.service";

export function useGithubRepos() {
  return useQuery({
    queryKey: ["github-repos"],
    queryFn: () => getGithubRepos(githubApiAdapter),
  });
}
