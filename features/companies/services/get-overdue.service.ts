import type { CompanyRepository } from "../api/company.port";

export function getOverdue(repository: CompanyRepository, days = 7) {
  return repository.getOverdue(days);
}
