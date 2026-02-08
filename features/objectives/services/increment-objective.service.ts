import type { ObjectiveRepository } from "../api/objective.port";
import type { ObjectiveType } from "../types/objective-type.type";

export function incrementObjective(
  repository: ObjectiveRepository,
  type: ObjectiveType,
) {
  return repository.increment(type);
}
