import type { CategoryRepository } from "../api/category.port";

export function deleteCategory(repository: CategoryRepository, id: string) {
  return repository.delete(id);
}
