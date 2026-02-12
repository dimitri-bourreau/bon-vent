import type { CompanyRepository } from "../api/company.port";

export function getInterviews(repository: CompanyRepository) {
  return repository.getInterviews();
}
