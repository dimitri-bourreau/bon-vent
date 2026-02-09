"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchIssues,
  type FetchIssuesResult,
} from "@/features/github/api/github-api.service";
import type { GithubRepo } from "@/features/github/types/github-repo.type";

export function useGithubIssues(
  repos: GithubRepo[],
  token: string | null,
  goodFirstIssueOnly: boolean,
) {
  const repoIds = repos.map((repo) => repo.id).join(",");

  return useQuery<FetchIssuesResult>({
    queryKey: ["github-issues", repoIds, goodFirstIssueOnly, token],
    queryFn: () => fetchIssues(repos, token, goodFirstIssueOnly),
    enabled: repos.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
