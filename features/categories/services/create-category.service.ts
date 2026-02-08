import type { CategoryRepository } from "../api/category.port";
import type { CreateCategoryDTO } from "../types/create-category-dto.type";

export function createCategory(repository: CategoryRepository, dto: CreateCategoryDTO) {
  return repository.create(dto);
}
