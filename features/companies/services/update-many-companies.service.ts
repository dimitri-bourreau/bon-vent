import type { CompanyRepository } from "../api/company.port";
import type { BulkUpdateDTO } from "../types/bulk-update-dto.type";
import type { Company } from "../types/company.type";

export async function updateManyCompanies(
  repository: CompanyRepository,
  dto: BulkUpdateDTO,
): Promise<Company[]> {
  const updates = dto.ids.map(async (id) => {
    const company = await repository.getById(id);
    if (!company) return null;

    let categories = company.categories;

    if (dto.categories !== undefined) {
      categories = dto.categories;
    } else {
      if (dto.addCategories) {
        categories = [...new Set([...categories, ...dto.addCategories])];
      }
      if (dto.removeCategories) {
        categories = categories.filter(
          (c) => !dto.removeCategories?.includes(c),
        );
      }
    }

    const contactedAt = dto.clearContactedAt
      ? undefined
      : (dto.contactedAt ?? company.contactedAt);

    return repository.update({
      id,
      contactedAt,
      categories,
    });
  });

  const results = await Promise.all(updates);
  return results.filter((c): c is Company => c !== null);
}
