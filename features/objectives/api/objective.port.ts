import type { Objective } from "../types/objective.type";
import type { CreateObjectiveDTO } from "../types/create-objective-dto.type";
import type { UpdateObjectiveDTO } from "../types/update-objective-dto.type";
import type { ObjectiveType } from "../types/objective-type.type";

export interface ObjectiveRepository {
  getAll(): Promise<Objective[]>;
  getByType(type: ObjectiveType): Promise<Objective | undefined>;
  getCurrentWeek(): Promise<Objective[]>;
  create(dto: CreateObjectiveDTO): Promise<Objective>;
  update(dto: UpdateObjectiveDTO): Promise<Objective>;
  increment(type: ObjectiveType): Promise<Objective>;
  decrement(type: ObjectiveType): Promise<Objective>;
  resetWeek(): Promise<void>;
}
