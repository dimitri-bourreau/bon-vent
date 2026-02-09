import type { CompanyRepository } from "../api/company.port";

export function getAwaitingResponse(repository: CompanyRepository) {
  return repository.getAwaitingResponse();
}
