import { v4 as uuid } from "uuid";
import { getDB } from "@/features/db/indexeddb";
import type { ZoneRepository } from "../ports/zone.port";
import type { Zone, CreateZoneDTO, UpdateZoneDTO } from "../domain/types";

export class ZoneIndexedDBAdapter implements ZoneRepository {
  async getAll(): Promise<Zone[]> {
    const db = await getDB();
    const zones = await db.getAll("zones");
    return zones.sort((a, b) => a.order - b.order);
  }

  async getById(id: string): Promise<Zone | undefined> {
    const db = await getDB();
    return db.get("zones", id);
  }

  async create(dto: CreateZoneDTO): Promise<Zone> {
    const db = await getDB();
    const all = await this.getAll();
    const zone: Zone = {
      id: uuid(),
      name: dto.name,
      order: dto.order ?? all.length,
    };
    await db.put("zones", zone);
    return zone;
  }

  async update(dto: UpdateZoneDTO): Promise<Zone> {
    const db = await getDB();
    const existing = await this.getById(dto.id);
    if (!existing) throw new Error("Zone not found");

    const updated: Zone = { ...existing, ...dto };
    await db.put("zones", updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("zones", id);
  }
}

export const zoneAdapter = new ZoneIndexedDBAdapter();
