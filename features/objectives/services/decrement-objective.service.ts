import type { ObjectiveRepository } from "../api/objective.port";
import type { ObjectiveType } from "../types/objective-type.type";

export function decrementObjective(
  repository: ObjectiveRepository,
  type: ObjectiveType,
) {
  return repository.decrement(type);
}
