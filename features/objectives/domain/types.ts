export type ObjectiveType = "comment" | "contact" | "message";

export interface Objective {
  id: string;
  type: ObjectiveType;
  target: number;
  current: number;
  weekStart: string;
}

export interface CreateObjectiveDTO {
  type: ObjectiveType;
  target: number;
}

export interface UpdateObjectiveDTO {
  id: string;
  target?: number;
  current?: number;
}
