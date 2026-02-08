import type { ObjectiveType } from "@/features/objectives/domain/types";
import type { InteractionRepository } from "../ports/interaction.port";
import type { CreateInteractionDTO } from "../domain/types";

export function createInteractionService(repository: InteractionRepository) {
  return {
    getAll: () => repository.getAll(),
    getByType: (type: ObjectiveType) => repository.getByType(type),
    getThisWeek: () => repository.getThisWeek(),
    create: (dto: CreateInteractionDTO) => repository.create(dto),
    delete: (id: string) => repository.delete(id),
  };
}

export type InteractionService = ReturnType<typeof createInteractionService>;
