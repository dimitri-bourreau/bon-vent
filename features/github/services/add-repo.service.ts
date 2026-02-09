import type { GithubRepository } from "../api/github.port";
import type { CreateGithubRepoDTO } from "../types/create-repo-dto.type";

export function addGithubRepo(
  repository: GithubRepository,
  dto: CreateGithubRepoDTO,
) {
  return repository.add(dto);
}
