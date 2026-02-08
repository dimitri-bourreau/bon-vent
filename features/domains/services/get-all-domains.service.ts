import type { DomainRepository } from "../api/domain.port";

export function getAllDomains(repository: DomainRepository) {
  return repository.getAll();
}
