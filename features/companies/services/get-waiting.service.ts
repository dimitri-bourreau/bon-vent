import type { CompanyRepository } from "../api/company.port";

export function getWaiting(repository: CompanyRepository) {
  return repository.getWaiting();
}
