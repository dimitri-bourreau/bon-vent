import { v4 as uuid } from "uuid";
import type { CategoryRepository } from "./category.port";
import type { Category } from "../types/category.type";
import type { CreateCategoryDTO } from "../types/create-category-dto.type";
import type { UpdateCategoryDTO } from "../types/update-category-dto.type";

const fakeCategories: Category[] = [
  { id: "1", name: "Tech", order: 0 },
  { id: "2", name: "Finance", order: 1 },
  { id: "3", name: "Startup", order: 2 },
];

export class CategoryFakeAdapter implements CategoryRepository {
  private categories = [...fakeCategories];

  async getAll(): Promise<Category[]> {
    return this.categories.sort((a, b) => a.order - b.order);
  }

  async getById(id: string): Promise<Category | undefined> {
    return this.categories.find((c) => c.id === id);
  }

  async create(dto: CreateCategoryDTO): Promise<Category> {
    const category: Category = {
      id: uuid(),
      name: dto.name,
      order: dto.order ?? this.categories.length,
    };
    this.categories.push(category);
    return category;
  }

  async update(dto: UpdateCategoryDTO): Promise<Category> {
    const index = this.categories.findIndex((c) => c.id === dto.id);
    if (index === -1) throw new Error("Category not found");

    this.categories[index] = { ...this.categories[index], ...dto };
    return this.categories[index];
  }

  async delete(id: string): Promise<void> {
    this.categories = this.categories.filter((c) => c.id !== id);
  }
}

export const categoryFakeAdapter = new CategoryFakeAdapter();
