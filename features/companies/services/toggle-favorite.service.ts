import type { CompanyRepository } from "../api/company.port";

export async function toggleFavorite(repository: CompanyRepository, id: string) {
  const company = await repository.getById(id);
  if (!company) throw new Error("Company not found");
  return repository.update({ id, isFavorite: !company.isFavorite });
}
