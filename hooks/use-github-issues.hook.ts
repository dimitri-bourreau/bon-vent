"use client";

import { useMemo, useCallback } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import {
  fetchRepoIssues,
  clearIssuesCache,
  type RepoIssuesResult,
} from "@/features/github/api/github-api.service";
import type { GithubRepo } from "@/features/github/types/github-repo.type";
import type { GithubIssue } from "@/features/github/types/github-issue.type";

export interface GithubIssuesState {
  issues: GithubIssue[];
  errors: string[];
  isLoading: boolean;
  loadedRepos: number;
  totalRepos: number;
  refetch: () => void;
}

export function useGithubIssues(
  repos: GithubRepo[],
  token: string | null | undefined,
  goodFirstIssueOnly: boolean,
  tokenLoading: boolean,
): GithubIssuesState {
  const queryClient = useQueryClient();

  const queries = useQueries({
    queries: repos.map((repo) => ({
      queryKey: ["github-issues", repo.fullName, goodFirstIssueOnly, token],
      queryFn: () => fetchRepoIssues(repo, token ?? null, goodFirstIssueOnly),
      staleTime: 5 * 60 * 1000,
      enabled: !tokenLoading,
    })),
  });

  const refetch = useCallback(async () => {
    await clearIssuesCache();
    queryClient.invalidateQueries({
      queryKey: ["github-issues"],
      refetchType: "all",
    });
  }, [queryClient]);

  return useMemo(() => {
    const allIssues: GithubIssue[] = [];
    const errors: string[] = [];
    let loadedRepos = 0;

    for (const query of queries) {
      if (query.isSuccess) {
        const result = query.data as RepoIssuesResult;
        allIssues.push(...result.issues);
        if (result.error) {
          errors.push(`${result.repoFullName}: ${result.error}`);
        }
        loadedRepos++;
      } else if (query.isError) {
        errors.push("Erreur de chargement");
        loadedRepos++;
      }
    }

    const sorted = allIssues.sort((issueA, issueB) => {
      const dateA = issueA.updatedAt ?? issueA.createdAt;
      const dateB = issueB.updatedAt ?? issueB.createdAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    const isLoading = tokenLoading || queries.some((q) => q.isLoading);

    return {
      issues: sorted,
      errors,
      isLoading,
      loadedRepos,
      totalRepos: repos.length,
      refetch,
    };
  }, [queries, repos.length, tokenLoading, refetch]);
}
