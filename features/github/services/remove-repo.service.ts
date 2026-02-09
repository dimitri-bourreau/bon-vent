import type { GithubRepository } from "../api/github.port";

export function removeGithubRepo(repository: GithubRepository, id: string) {
  return repository.remove(id);
}
