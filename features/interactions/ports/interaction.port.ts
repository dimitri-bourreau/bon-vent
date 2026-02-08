import type { ObjectiveType } from "@/features/objectives/domain/types";
import type { Interaction, CreateInteractionDTO } from "../domain/types";

export interface InteractionRepository {
  getAll(): Promise<Interaction[]>;
  getByType(type: ObjectiveType): Promise<Interaction[]>;
  getThisWeek(): Promise<Interaction[]>;
  create(dto: CreateInteractionDTO): Promise<Interaction>;
  delete(id: string): Promise<void>;
}
