import type { ZoneRepository } from "../ports/zone.port";
import type { CreateZoneDTO, UpdateZoneDTO } from "../domain/types";

export function createZoneService(repository: ZoneRepository) {
  return {
    getAll: () => repository.getAll(),
    getById: (id: string) => repository.getById(id),
    create: (dto: CreateZoneDTO) => repository.create(dto),
    update: (dto: UpdateZoneDTO) => repository.update(dto),
    delete: (id: string) => repository.delete(id),
  };
}

export type ZoneService = ReturnType<typeof createZoneService>;
