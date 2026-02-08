import type { CompanyRepository } from "../api/company.port";

export function getContacted(repository: CompanyRepository) {
  return repository.getContacted();
}
