import type { CompanyRepository } from "../ports/company.port";
import type {
  CreateCompanyDTO,
  UpdateCompanyDTO,
  AddTimelineEventDTO,
  ApplicationStage,
} from "../domain/types";

export function createCompanyService(repository: CompanyRepository) {
  return {
    getAll: () => repository.getAll(),
    getById: (id: string) => repository.getById(id),
    getByCategory: (category: string) => repository.getByCategory(category),
    getFavorites: () => repository.getFavorites(),
    getContacted: () => repository.getContacted(),
    getOverdue: (days = 7) => repository.getOverdue(days),
    getWaiting: () => repository.getWaiting(),
    search: (query: string) => repository.search(query),
    findDuplicates: (name: string) => repository.findDuplicates(name),
    create: (dto: CreateCompanyDTO) => repository.create(dto),
    update: (dto: UpdateCompanyDTO) => repository.update(dto),
    addTimelineEvent: (dto: AddTimelineEventDTO) =>
      repository.addTimelineEvent(dto),
    delete: (id: string) => repository.delete(id),
    deleteMany: (ids: string[]) => repository.deleteMany(ids),

    markAsContacted: (id: string) =>
      repository.update({
        id,
        status: "waiting",
        contactedAt: new Date().toISOString(),
      } as UpdateCompanyDTO & { contactedAt: string }),

    toggleFavorite: async (id: string) => {
      const company = await repository.getById(id);
      if (!company) throw new Error("Company not found");
      return repository.update({ id, isFavorite: !company.isFavorite });
    },

    updateApplicationStage: (id: string, stage: ApplicationStage) =>
      repository.update({ id, applicationStage: stage }),
  };
}

export type CompanyService = ReturnType<typeof createCompanyService>;
