import type { Category } from "../types/category.type";
import type { CreateCategoryDTO } from "../types/create-category-dto.type";
import type { UpdateCategoryDTO } from "../types/update-category-dto.type";

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category | undefined>;
  create(dto: CreateCategoryDTO): Promise<Category>;
  update(dto: UpdateCategoryDTO): Promise<Category>;
  delete(id: string): Promise<void>;
}
