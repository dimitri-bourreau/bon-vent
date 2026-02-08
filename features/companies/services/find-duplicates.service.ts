import type { CompanyRepository } from "../api/company.port";

export function findDuplicates(repository: CompanyRepository, name: string) {
  return repository.findDuplicates(name);
}
