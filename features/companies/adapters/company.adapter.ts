import { v4 as uuid } from "uuid";
import { getDB } from "@/features/db/indexeddb";
import { isOverdue } from "@/features/dates/dates";
import type { CompanyRepository } from "../ports/company.port";
import type {
  Company,
  CreateCompanyDTO,
  UpdateCompanyDTO,
} from "../domain/types";

export class CompanyIndexedDBAdapter implements CompanyRepository {
  async getAll(): Promise<Company[]> {
    const db = await getDB();
    return db.getAll("companies");
  }

  async getById(id: string): Promise<Company | undefined> {
    const db = await getDB();
    return db.get("companies", id);
  }

  async getByZone(zone: string): Promise<Company[]> {
    const db = await getDB();
    return db.getAllFromIndex("companies", "by-zone", zone);
  }

  async getByStatus(status: string): Promise<Company[]> {
    const db = await getDB();
    return db.getAllFromIndex("companies", "by-status", status);
  }

  async getFavorites(): Promise<Company[]> {
    const all = await this.getAll();
    return all.filter((c) => c.isFavorite);
  }

  async getContacted(): Promise<Company[]> {
    const all = await this.getAll();
    return all.filter((c) => c.contactedAt);
  }

  async getOverdue(days = 7): Promise<Company[]> {
    const all = await this.getAll();
    return all.filter(
      (c) =>
        c.status === "waiting" &&
        c.contactedAt &&
        isOverdue(c.contactedAt, days),
    );
  }

  async getWaiting(): Promise<Company[]> {
    const all = await this.getAll();
    return all.filter(
      (c) =>
        c.status === "waiting" && c.contactedAt && !isOverdue(c.contactedAt, 7),
    );
  }

  async create(dto: CreateCompanyDTO): Promise<Company> {
    const db = await getDB();
    const now = new Date().toISOString();
    const company: Company = {
      id: uuid(),
      name: dto.name,
      zone: dto.zone,
      website: dto.website,
      contactEmail: dto.contactEmail,
      contactName: dto.contactName,
      note: dto.note,
      status: dto.status ?? "favorite",
      isFavorite: dto.isFavorite ?? true,
      contactedAt: dto.contactedAt,
      createdAt: now,
      updatedAt: now,
    };
    await db.put("companies", company);
    return company;
  }

  async update(dto: UpdateCompanyDTO): Promise<Company> {
    const db = await getDB();
    const existing = await this.getById(dto.id);
    if (!existing) throw new Error("Company not found");

    const updated: Company = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    await db.put("companies", updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("companies", id);
  }
}

export const companyAdapter = new CompanyIndexedDBAdapter();
