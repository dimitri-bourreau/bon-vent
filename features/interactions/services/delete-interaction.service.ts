import type { InteractionRepository } from "../api/interaction.port";

export function deleteInteraction(
  repository: InteractionRepository,
  id: string,
) {
  return repository.delete(id);
}
