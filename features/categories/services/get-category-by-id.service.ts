import type { CategoryRepository } from "../api/category.port";

export function getCategoryById(repository: CategoryRepository, id: string) {
  return repository.getById(id);
}
