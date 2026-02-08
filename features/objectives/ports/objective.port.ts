import type {
  Objective,
  CreateObjectiveDTO,
  UpdateObjectiveDTO,
  ObjectiveType,
} from "../domain/types";

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
