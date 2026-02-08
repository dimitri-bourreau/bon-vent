import type { CategoryRepository } from "../api/category.port";

export function getAllCategories(repository: CategoryRepository) {
  return repository.getAll();
}
