import type { ObjectiveType } from "@/features/objectives/types/objective-type.type";

export interface Interaction {
  id: string;
  type: ObjectiveType;
  date: string;
  note?: string;
}
