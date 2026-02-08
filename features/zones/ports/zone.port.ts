import type { Zone, CreateZoneDTO, UpdateZoneDTO } from "../domain/types";

export interface ZoneRepository {
  getAll(): Promise<Zone[]>;
  getById(id: string): Promise<Zone | undefined>;
  create(dto: CreateZoneDTO): Promise<Zone>;
  update(dto: UpdateZoneDTO): Promise<Zone>;
  delete(id: string): Promise<void>;
}
