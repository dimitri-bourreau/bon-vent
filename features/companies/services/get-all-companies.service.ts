import type { CompanyRepository } from "../api/company.port";

export function getAllCompanies(repository: CompanyRepository) {
  return repository.getAll();
}
