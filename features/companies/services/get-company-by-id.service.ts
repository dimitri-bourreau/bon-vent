import type { CompanyRepository } from "../api/company.port";

export function getCompanyById(repository: CompanyRepository, id: string) {
  return repository.getById(id);
}
