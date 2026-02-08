import type { InteractionRepository } from "../api/interaction.port";

export function getThisWeekInteractions(repository: InteractionRepository) {
  return repository.getThisWeek();
}
