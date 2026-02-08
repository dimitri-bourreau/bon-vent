import type { CompanyRepository } from "../api/company.port";
import type { CreateCompanyDTO } from "../types/create-company-dto.type";

export function createCompany(repository: CompanyRepository, dto: CreateCompanyDTO) {
  return repository.create(dto);
}
