import { getDB } from "@/features/db/indexeddb";
import type { GithubRepo } from "../types/github-repo.type";
import type { GithubIssue } from "../types/github-issue.type";

interface GithubApiIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  labels: Array<{ name: string }>;
  state: string;
  created_at: string;
  comments: number;
}

export interface FetchIssuesResult {
  issues: GithubIssue[];
  error: string | null;
  fromCache: boolean;
}

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

export async function fetchIssues(
  repos: GithubRepo[],
  token: string | null,
  goodFirstIssueOnly: boolean,
): Promise<FetchIssuesResult> {
  const allIssues: GithubIssue[] = [];
  let hasError = false;
  let errorMessage: string | null = null;
  let allFromCache = true;

  for (const repo of repos) {
    const result = await fetchRepoIssuesWithCache(
      repo,
      token,
      goodFirstIssueOnly,
    );
    if (result.error) {
      hasError = true;
      errorMessage = result.error;
    }
    if (!result.fromCache) {
      allFromCache = false;
    }
    allIssues.push(...result.issues);
  }

  const sorted = allIssues.sort(
    (issueA, issueB) =>
      new Date(issueB.createdAt).getTime() -
      new Date(issueA.createdAt).getTime(),
  );

  return {
    issues: sorted,
    error: hasError ? errorMessage : null,
    fromCache: allFromCache,
  };
}

async function fetchRepoIssuesWithCache(
  repo: GithubRepo,
  token: string | null,
  goodFirstIssueOnly: boolean,
): Promise<{
  issues: GithubIssue[];
  error: string | null;
  fromCache: boolean;
}> {
  const database = await getDB();
  const cached = await database.get("github-issues-cache", repo.fullName);

  if (cached) {
    const cacheAge = Date.now() - new Date(cached.fetchedAt).getTime();
    if (cacheAge < CACHE_DURATION_MS) {
      const issues = goodFirstIssueOnly
        ? (cached.goodFirstIssues ?? [])
        : cached.issues;
      return { issues, error: null, fromCache: true };
    }
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const [normalIssues, gfiIssues] = await Promise.all([
      fetchFromApi(repo.fullName, headers, false),
      fetchFromApi(repo.fullName, headers, true),
    ]);

    if (!normalIssues.ok || !gfiIssues.ok) {
      const status = !normalIssues.ok ? normalIssues.status : gfiIssues.status;
      if (cached) {
        const issues = goodFirstIssueOnly
          ? (cached.goodFirstIssues ?? [])
          : cached.issues;
        return {
          issues,
          error: `API GitHub: ${status} (données en cache utilisées)`,
          fromCache: true,
        };
      }
      return {
        issues: [],
        error: `API GitHub: ${status}`,
        fromCache: false,
      };
    }

    const issues = mapApiIssues(normalIssues.data, repo.fullName);
    const goodFirstIssues = mapApiIssues(gfiIssues.data, repo.fullName);

    await database.put("github-issues-cache", {
      repoFullName: repo.fullName,
      issues,
      goodFirstIssues,
      fetchedAt: new Date().toISOString(),
    });

    return {
      issues: goodFirstIssueOnly ? goodFirstIssues : issues,
      error: null,
      fromCache: false,
    };
  } catch {
    if (cached) {
      const issues = goodFirstIssueOnly
        ? (cached.goodFirstIssues ?? [])
        : cached.issues;
      return {
        issues,
        error: "Erreur réseau (données en cache utilisées)",
        fromCache: true,
      };
    }
    return { issues: [], error: "Erreur réseau", fromCache: false };
  }
}

async function fetchFromApi(
  repoFullName: string,
  headers: HeadersInit,
  goodFirstIssue: boolean,
): Promise<{ ok: boolean; status?: number; data: GithubApiIssue[] }> {
  let query = `repo:${repoFullName} is:issue is:open`;
  if (goodFirstIssue) {
    query += ' label:"good first issue"';
  }

  const allItems: GithubApiIssue[] = [];
  let page = 1;
  const maxPages = 3;

  while (page <= maxPages) {
    const params = new URLSearchParams({
      q: query,
      per_page: "100",
      page: page.toString(),
      sort: "created",
      order: "desc",
    });

    const url = `https://api.github.com/search/issues?${params}`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (allItems.length > 0) {
        return { ok: true, data: allItems };
      }
      return { ok: false, status: response.status, data: [] };
    }

    const data: { items: GithubApiIssue[]; total_count: number } =
      await response.json();
    allItems.push(...data.items);

    if (data.items.length < 100 || allItems.length >= data.total_count) {
      break;
    }

    page++;
  }

  return { ok: true, data: allItems };
}

function mapApiIssues(
  items: GithubApiIssue[],
  repoFullName: string,
): GithubIssue[] {
  return items.map((issue) => ({
    id: issue.id,
    number: issue.number,
    title: issue.title,
    url: issue.html_url,
    labels: issue.labels.map((label) => label.name),
    state: issue.state,
    createdAt: issue.created_at,
    repositoryFullName: repoFullName,
    comments: issue.comments,
  }));
}
