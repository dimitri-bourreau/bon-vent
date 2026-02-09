import type { GithubRepo } from "../types/github-repo.type";
import type { CreateGithubRepoDTO } from "../types/create-repo-dto.type";

export interface GithubRepository {
  getAll(): Promise<GithubRepo[]>;
  add(dto: CreateGithubRepoDTO): Promise<GithubRepo>;
  remove(id: string): Promise<void>;
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
}
