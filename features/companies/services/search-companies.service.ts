import type { CompanyRepository } from "../api/company.port";

export function searchCompanies(repository: CompanyRepository, query: string) {
  return repository.search(query);
}
