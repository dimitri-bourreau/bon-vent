import type { GithubRepository } from "../api/github.port";

export function getGithubRepos(repository: GithubRepository) {
  return repository.getAll();
}
