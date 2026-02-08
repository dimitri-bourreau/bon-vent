import type { ObjectiveRepository } from "../ports/objective.port";
import type {
  CreateObjectiveDTO,
  UpdateObjectiveDTO,
  ObjectiveType,
} from "../domain/types";

export function createObjectiveService(repository: ObjectiveRepository) {
  return {
    getAll: () => repository.getAll(),
    getCurrentWeek: () => repository.getCurrentWeek(),
    getByType: (type: ObjectiveType) => repository.getByType(type),
    create: (dto: CreateObjectiveDTO) => repository.create(dto),
    update: (dto: UpdateObjectiveDTO) => repository.update(dto),
    increment: (type: ObjectiveType) => repository.increment(type),
    decrement: (type: ObjectiveType) => repository.decrement(type),
    resetWeek: () => repository.resetWeek(),
  };
}

export type ObjectiveService = ReturnType<typeof createObjectiveService>;
