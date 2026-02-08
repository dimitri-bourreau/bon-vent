import type { ObjectiveRepository } from "../api/objective.port";

export function getCurrentWeekObjectives(repository: ObjectiveRepository) {
  return repository.getCurrentWeek();
}
