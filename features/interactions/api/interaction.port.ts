import type { Interaction } from "../types/interaction.type";
import type { CreateInteractionDTO } from "../types/create-interaction-dto.type";
import type { ObjectiveType } from "@/features/objectives/types/objective-type.type";

export interface InteractionRepository {
  getAll(): Promise<Interaction[]>;
  getByType(type: ObjectiveType): Promise<Interaction[]>;
  getThisWeek(): Promise<Interaction[]>;
  create(dto: CreateInteractionDTO): Promise<Interaction>;
  delete(id: string): Promise<void>;
}
