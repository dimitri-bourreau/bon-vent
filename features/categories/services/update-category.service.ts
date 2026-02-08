import type { CategoryRepository } from "../api/category.port";
import type { UpdateCategoryDTO } from "../types/update-category-dto.type";

export function updateCategory(repository: CategoryRepository, dto: UpdateCategoryDTO) {
  return repository.update(dto);
}
