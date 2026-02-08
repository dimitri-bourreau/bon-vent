import { v4 as uuid } from "uuid";
import { getDB } from "@/features/db/indexeddb";
import type { CategoryRepository } from "./category.port";
import type { Category } from "../types/category.type";
import type { CreateCategoryDTO } from "../types/create-category-dto.type";
import type { UpdateCategoryDTO } from "../types/update-category-dto.type";

export class CategoryApiAdapter implements CategoryRepository {
  async getAll(): Promise<Category[]> {
    const db = await getDB();
    const categories = await db.getAll("zones");
    return categories.sort((a, b) => a.order - b.order);
  }

  async getById(id: string): Promise<Category | undefined> {
    const db = await getDB();
    return db.get("zones", id);
  }

  async create(dto: CreateCategoryDTO): Promise<Category> {
    const db = await getDB();
    const all = await this.getAll();
    const category: Category = {
      id: uuid(),
      name: dto.name,
      order: dto.order ?? all.length,
    };
    await db.put("zones", category);
    return category;
  }

  async update(dto: UpdateCategoryDTO): Promise<Category> {
    const db = await getDB();
    const existing = await this.getById(dto.id);
    if (!existing) throw new Error("Category not found");

    const updated: Category = { ...existing, ...dto };
    await db.put("zones", updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("zones", id);
  }
}

export const categoryApiAdapter = new CategoryApiAdapter();
