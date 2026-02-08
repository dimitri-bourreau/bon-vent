import type { CompanyRepository } from "../api/company.port";

export function markAsContacted(repository: CompanyRepository, id: string) {
  return repository.update({
    id,
    status: "waiting",
    contactedAt: new Date().toISOString(),
  });
}
