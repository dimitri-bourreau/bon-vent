import type { DomainRepository } from "../ports/domain.port";
import type { CreateDomainDTO, UpdateDomainDTO } from "../domain/types";

export function createDomainService(repository: DomainRepository) {
  return {
    getAll: () => repository.getAll(),
    getById: (id: string) => repository.getById(id),
    create: (dto: CreateDomainDTO) => repository.create(dto),
    update: (dto: UpdateDomainDTO) => repository.update(dto),
    delete: (id: string) => repository.delete(id),
  };
}

export type DomainService = ReturnType<typeof createDomainService>;
