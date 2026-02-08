import type { CompanyRepository } from "../api/company.port";

export function deleteCompany(repository: CompanyRepository, id: string) {
  return repository.delete(id);
}
