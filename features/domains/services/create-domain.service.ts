import type { DomainRepository } from "../api/domain.port";
import type { CreateDomainDTO } from "../types/create-domain-dto.type";

export function createDomain(
  repository: DomainRepository,
  dto: CreateDomainDTO,
) {
  return repository.create(dto);
}
