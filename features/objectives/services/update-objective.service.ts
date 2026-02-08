import type { ObjectiveRepository } from "../api/objective.port";
import type { UpdateObjectiveDTO } from "../types/update-objective-dto.type";

export function updateObjective(repository: ObjectiveRepository, dto: UpdateObjectiveDTO) {
  return repository.update(dto);
}
