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
  updated_at: string;
  comments: number;
}

export interface RepoIssuesResult {
  repoFullName: string;
  issues: GithubIssue[];
  error: string | null;
  fromCache: boolean;
}

const CACHE_DURATION_MS = 60 * 60 * 1000;
const ISSUES_PER_REPO = 30;

export async function clearIssuesCache(): Promise<void> {
  const database = await getDB();
  await database.clear("github-issues-cache");
}

export async function fetchRepoIssues(
  repo: GithubRepo,
  token: string | null,
  goodFirstIssueOnly: boolean,
): Promise<RepoIssuesResult> {
  const database = await getDB();
  const cacheKey = `${repo.fullName}-${goodFirstIssueOnly ? "gfi" : "all"}`;
  const cached = await database.get("github-issues-cache", cacheKey);

  if (cached) {
    const cacheAge = Date.now() - new Date(cached.fetchedAt).getTime();
    if (cacheAge < CACHE_DURATION_MS) {
      return {
        repoFullName: repo.fullName,
        issues: cached.issues,
        error: null,
        fromCache: true,
      };
    }
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const result = await fetchFromApi(
      repo.fullName,
      headers,
      goodFirstIssueOnly,
    );

    if (!result.ok) {
      if (cached) {
        return {
          repoFullName: repo.fullName,
          issues: cached.issues,
          error: `API GitHub: ${result.status} (cache utilisé)`,
          fromCache: true,
        };
      }
      return {
        repoFullName: repo.fullName,
        issues: [],
        error: `API GitHub: ${result.status}`,
        fromCache: false,
      };
    }

    const issues = mapApiIssues(result.data, repo.fullName);

    await database.put("github-issues-cache", {
      repoFullName: cacheKey,
      issues,
      fetchedAt: new Date().toISOString(),
    });

    return {
      repoFullName: repo.fullName,
      issues,
      error: null,
      fromCache: false,
    };
  } catch {
    if (cached) {
      return {
        repoFullName: repo.fullName,
        issues: cached.issues,
        error: "Erreur réseau (cache utilisé)",
        fromCache: true,
      };
    }
    return {
      repoFullName: repo.fullName,
      issues: [],
      error: "Erreur réseau",
      fromCache: false,
    };
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

  const params = new URLSearchParams({
    q: query,
    per_page: ISSUES_PER_REPO.toString(),
    sort: "updated",
    order: "desc",
  });

  const url = `https://api.github.com/search/issues?${params}`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    return { ok: false, status: response.status, data: [] };
  }

  const data: { items: GithubApiIssue[] } = await response.json();
  return { ok: true, data: data.items };
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
    updatedAt: issue.updated_at,
    repositoryFullName: repoFullName,
    comments: issue.comments,
  }));
}
