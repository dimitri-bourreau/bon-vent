import type { ObjectiveType } from "./objective-type.type";

export interface Objective {
  id: string;
  type: ObjectiveType;
  target: number;
  current: number;
  weekStart: string;
}
