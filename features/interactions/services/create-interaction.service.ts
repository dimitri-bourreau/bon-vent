import type { InteractionRepository } from "../api/interaction.port";
import type { CreateInteractionDTO } from "../types/create-interaction-dto.type";

export function createInteraction(
  repository: InteractionRepository,
  dto: CreateInteractionDTO,
) {
  return repository.create(dto);
}
