import type { CompanyRepository } from "../api/company.port";
import type { UpdateCompanyDTO } from "../types/update-company-dto.type";

export function updateCompany(
  repository: CompanyRepository,
  dto: UpdateCompanyDTO,
) {
  return repository.update(dto);
}
