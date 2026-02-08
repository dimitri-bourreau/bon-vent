import type { ObjectiveType } from "@/features/objectives/domain/types";

export interface Interaction {
  id: string;
  type: ObjectiveType;
  date: string;
  note?: string;
}

export interface CreateInteractionDTO {
  type: ObjectiveType;
  note?: string;
}
