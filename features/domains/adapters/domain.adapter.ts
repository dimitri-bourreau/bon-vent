import { v4 as uuid } from "uuid";
import { getDB } from "@/features/db/indexeddb";
import type { DomainRepository } from "../ports/domain.port";
import type { Domain, CreateDomainDTO, UpdateDomainDTO } from "../domain/types";

const DEFAULT_COLORS = [
  "#6366f1",
  "#06b6d4",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
];

export class DomainIndexedDBAdapter implements DomainRepository {
  async getAll(): Promise<Domain[]> {
    const db = await getDB();
    const domains = await db.getAll("domains");
    return domains.sort((a, b) => a.order - b.order);
  }

  async getById(id: string): Promise<Domain | undefined> {
    const db = await getDB();
    return db.get("domains", id);
  }

  async create(dto: CreateDomainDTO): Promise<Domain> {
    const db = await getDB();
    const all = await this.getAll();
    const domain: Domain = {
      id: uuid(),
      name: dto.name,
      color: dto.color ?? DEFAULT_COLORS[all.length % DEFAULT_COLORS.length],
      order: all.length,
      createdAt: new Date().toISOString(),
    };
    await db.put("domains", domain);
    return domain;
  }

  async update(dto: UpdateDomainDTO): Promise<Domain> {
    const db = await getDB();
    const existing = await this.getById(dto.id);
    if (!existing) throw new Error("Domain not found");

    const updated: Domain = { ...existing, ...dto };
    await db.put("domains", updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("domains", id);
  }
}

export const domainAdapter = new DomainIndexedDBAdapter();
