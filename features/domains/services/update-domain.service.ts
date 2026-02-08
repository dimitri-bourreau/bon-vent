import type { DomainRepository } from "../api/domain.port";
import type { UpdateDomainDTO } from "../types/update-domain-dto.type";

export function updateDomain(
  repository: DomainRepository,
  dto: UpdateDomainDTO,
) {
  return repository.update(dto);
}
