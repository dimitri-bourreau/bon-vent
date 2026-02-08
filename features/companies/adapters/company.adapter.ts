import { v4 as uuid } from "uuid";
import { getDB } from "@/features/db/indexeddb";
import { isOverdue } from "@/features/dates/dates";
import type { CompanyRepository } from "../ports/company.port";
import type {
  Company,
  CreateCompanyDTO,
  UpdateCompanyDTO,
  AddTimelineEventDTO,
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

  async getByCategory(category: string): Promise<Company[]> {
    const all = await this.getAll();
    return all.filter((c) => c.categories.includes(category));
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

  async search(query: string): Promise<Company[]> {
    const all = await this.getAll();
    const q = query.toLowerCase();
    return all.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.note?.toLowerCase().includes(q) ||
        c.contactName?.toLowerCase().includes(q) ||
        c.categories.some((cat) => cat.toLowerCase().includes(q)),
    );
  }

  async findDuplicates(name: string): Promise<Company[]> {
    const all = await this.getAll();
    const normalized = name.toLowerCase().trim();
    return all.filter((c) => {
      const cName = c.name.toLowerCase().trim();
      return (
        cName === normalized ||
        cName.includes(normalized) ||
        normalized.includes(cName)
      );
    });
  }

  async create(dto: CreateCompanyDTO): Promise<Company> {
    const db = await getDB();
    const now = new Date().toISOString();
    const company: Company = {
      id: uuid(),
      name: dto.name,
      categories: dto.categories,
      website: dto.website,
      jobUrl: dto.jobUrl,
      contactEmail: dto.contactEmail,
      contactName: dto.contactName,
      note: dto.note,
      status: dto.status ?? "favorite",
      applicationStage: dto.applicationStage ?? "research",
      timeline: [],
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

  async addTimelineEvent(dto: AddTimelineEventDTO): Promise<Company> {
    const db = await getDB();
    const existing = await this.getById(dto.companyId);
    if (!existing) throw new Error("Company not found");

    const event = {
      id: uuid(),
      type: dto.type,
      date: new Date().toISOString(),
      content: dto.content,
    };

    const updated: Company = {
      ...existing,
      timeline: [...existing.timeline, event],
      lastInteractionAt: event.date,
      updatedAt: event.date,
    };
    await db.put("companies", updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("companies", id);
  }

  async deleteMany(ids: string[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction("companies", "readwrite");
    await Promise.all(ids.map((id) => tx.store.delete(id)));
    await tx.done;
  }
}

export const companyAdapter = new CompanyIndexedDBAdapter();
