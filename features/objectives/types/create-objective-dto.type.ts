import type { ObjectiveType } from "./objective-type.type";

export interface CreateObjectiveDTO {
  type: ObjectiveType;
  target: number;
}
