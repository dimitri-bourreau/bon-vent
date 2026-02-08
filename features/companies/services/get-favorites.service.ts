import type { CompanyRepository } from "../api/company.port";

export function getFavorites(repository: CompanyRepository) {
  return repository.getFavorites();
}
