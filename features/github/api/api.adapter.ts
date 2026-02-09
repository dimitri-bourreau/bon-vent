import { v4 as uuid } from "uuid";
import { getDB } from "@/features/db/indexeddb";
import type { GithubRepository } from "./github.port";
import type { GithubRepo } from "../types/github-repo.type";
import type { CreateGithubRepoDTO } from "../types/create-repo-dto.type";

const GITHUB_TOKEN_KEY = "github-token";

function parseGithubUrl(url: string): { owner: string; name: string } | null {
  const cleanUrl = url.trim().replace(/\/$/, "");
  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], name: match[2] };
}

class GithubApiAdapter implements GithubRepository {
  async getAll(): Promise<GithubRepo[]> {
    const database = await getDB();
    const repos = await database.getAll("github-repos");
    return repos.sort(
      (repoA, repoB) =>
        new Date(repoB.addedAt).getTime() - new Date(repoA.addedAt).getTime(),
    );
  }

  async add(dto: CreateGithubRepoDTO): Promise<GithubRepo> {
    const parsed = parseGithubUrl(dto.url);
    if (!parsed) {
      throw new Error("URL GitHub invalide");
    }

    const database = await getDB();
    const existing = await database.getAll("github-repos");
    const fullName = `${parsed.owner}/${parsed.name}`;
    const alreadyExists = existing.some((repo) => repo.fullName === fullName);
    if (alreadyExists) {
      throw new Error("Ce repo est déjà suivi");
    }

    const repo: GithubRepo = {
      id: uuid(),
      owner: parsed.owner,
      name: parsed.name,
      fullName,
      url: `https://github.com/${fullName}`,
      addedAt: new Date().toISOString(),
    };

    await database.put("github-repos", repo);
    return repo;
  }

  async remove(id: string): Promise<void> {
    const database = await getDB();
    await database.delete("github-repos", id);
  }

  async getToken(): Promise<string | null> {
    const database = await getDB();
    const setting = await database.get("settings", GITHUB_TOKEN_KEY);
    return setting?.value ?? null;
  }

  async setToken(token: string): Promise<void> {
    const database = await getDB();
    await database.put("settings", { key: GITHUB_TOKEN_KEY, value: token });
  }
}

export const githubApiAdapter = new GithubApiAdapter();
