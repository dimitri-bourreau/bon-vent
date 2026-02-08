import { v4 as uuid } from "uuid";
import { getDB } from "@/features/db/indexeddb";
import { getCurrentWeekStart } from "@/features/dates/dates";
import type { ObjectiveRepository } from "../ports/objective.port";
import type {
  Objective,
  CreateObjectiveDTO,
  UpdateObjectiveDTO,
  ObjectiveType,
} from "../domain/types";

export class ObjectiveIndexedDBAdapter implements ObjectiveRepository {
  async getAll(): Promise<Objective[]> {
    const db = await getDB();
    return db.getAll("objectives");
  }

  async getByType(type: ObjectiveType): Promise<Objective | undefined> {
    const current = await this.getCurrentWeek();
    return current.find((o) => o.type === type);
  }

  async getCurrentWeek(): Promise<Objective[]> {
    const db = await getDB();
    const weekStart = getCurrentWeekStart();
    return db.getAllFromIndex("objectives", "by-week", weekStart);
  }

  async create(dto: CreateObjectiveDTO): Promise<Objective> {
    const db = await getDB();
    const objective: Objective = {
      id: uuid(),
      type: dto.type,
      target: dto.target,
      current: 0,
      weekStart: getCurrentWeekStart(),
    };
    await db.put("objectives", objective);
    return objective;
  }

  async update(dto: UpdateObjectiveDTO): Promise<Objective> {
    const db = await getDB();
    const existing = await db.get("objectives", dto.id);
    if (!existing) throw new Error("Objective not found");

    const updated: Objective = { ...existing, ...dto };
    await db.put("objectives", updated);
    return updated;
  }

  async increment(type: ObjectiveType): Promise<Objective> {
    let objective = await this.getByType(type);
    if (!objective) {
      objective = await this.create({ type, target: 5 });
    }
    return this.update({ id: objective.id, current: objective.current + 1 });
  }

  async decrement(type: ObjectiveType): Promise<Objective> {
    const objective = await this.getByType(type);
    if (!objective) throw new Error("Objective not found");
    const newCurrent = Math.max(0, objective.current - 1);
    return this.update({ id: objective.id, current: newCurrent });
  }

  async resetWeek(): Promise<void> {
    const weekStart = getCurrentWeekStart();
    const types: ObjectiveType[] = ["comment", "contact", "message"];

    for (const type of types) {
      const existing = await this.getByType(type);
      if (!existing || existing.weekStart !== weekStart) {
        await this.create({ type, target: existing?.target ?? 5 });
      }
    }
  }
}

export const objectiveAdapter = new ObjectiveIndexedDBAdapter();
