import type { CompanyRepository } from "../api/company.port";

export function deleteManyCompanies(
  repository: CompanyRepository,
  ids: string[],
) {
  return repository.deleteMany(ids);
}
