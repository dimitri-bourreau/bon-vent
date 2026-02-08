import type { ObjectiveType } from "@/features/objectives/types/objective-type.type";

export interface CreateInteractionDTO {
  type: ObjectiveType;
  note?: string;
}
