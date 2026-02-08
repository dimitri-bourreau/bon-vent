import { v4 as uuid } from "uuid";
import { getDB } from "@/features/db/indexeddb";
import { getCurrentWeekStart } from "@/features/dates/dates";
import type { ObjectiveType } from "@/features/objectives/types/objective-type.type";
import type { InteractionRepository } from "./interaction.port";
import type { Interaction } from "../types/interaction.type";
import type { CreateInteractionDTO } from "../types/create-interaction-dto.type";

export class InteractionApiAdapter implements InteractionRepository {
  async getAll(): Promise<Interaction[]> {
    const db = await getDB();
    const interactions = await db.getAll("interactions");
    return interactions.sort((a, b) => b.date.localeCompare(a.date));
  }

  async getByType(type: ObjectiveType): Promise<Interaction[]> {
    const db = await getDB();
    return db.getAllFromIndex("interactions", "by-type", type);
  }

  async getThisWeek(): Promise<Interaction[]> {
    const all = await this.getAll();
    const weekStart = getCurrentWeekStart();
    return all.filter((i) => i.date >= weekStart);
  }

  async create(dto: CreateInteractionDTO): Promise<Interaction> {
    const db = await getDB();
    const interaction: Interaction = {
      id: uuid(),
      type: dto.type,
      date: new Date().toISOString(),
      note: dto.note,
    };
    await db.put("interactions", interaction);
    return interaction;
  }

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete("interactions", id);
  }
}

export const interactionApiAdapter = new InteractionApiAdapter();
