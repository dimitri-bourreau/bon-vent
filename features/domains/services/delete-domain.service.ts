import type { DomainRepository } from "../api/domain.port";

export function deleteDomain(repository: DomainRepository, id: string) {
  return repository.delete(id);
}
