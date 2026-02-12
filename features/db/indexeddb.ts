import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { ApplicationStage } from "@/features/companies/types/application-stage.type";
import type { TimelineEvent } from "@/features/companies/types/timeline-event.type";

export interface BonVentDB extends DBSchema {
  companies: {
    key: string;
    value: {
      id: string;
      name: string;
      categories: string[];
      website?: string;
      jobUrl?: string;
      contactEmail?: string;
      contactName?: string;
      note?: string;
      status: "favorite" | "contacted" | "waiting" | "follow_up";
      applicationStage: ApplicationStage;
      timeline: TimelineEvent[];
      contactedAt?: string;
      lastInteractionAt?: string;
      isFavorite: boolean;
      createdAt: string;
      updatedAt: string;
    };
    indexes: { "by-status": string; "by-favorite": number };
  };
  zones: {
    key: string;
    value: { id: string; name: string; order: number };
    indexes: { "by-order": number };
  };
  domains: {
    key: string;
    value: {
      id: string;
      name: string;
      color: string;
      order: number;
      createdAt: string;
    };
    indexes: { "by-order": number };
  };
  objectives: {
    key: string;
    value: {
      id: string;
      type: "comment" | "contact" | "message";
      target: number;
      current: number;
      weekStart: string;
    };
    indexes: { "by-type": string; "by-week": string };
  };
  interactions: {
    key: string;
    value: {
      id: string;
      type: "comment" | "contact" | "message";
      date: string;
      note?: string;
    };
    indexes: { "by-type": string; "by-date": string };
  };
  "github-repos": {
    key: string;
    value: {
      id: string;
      owner: string;
      name: string;
      fullName: string;
      url: string;
      addedAt: string;
    };
    indexes: { "by-added-at": string };
  };
  settings: {
    key: string;
    value: {
      key: string;
      value: string;
    };
  };
  "github-issues-cache": {
    key: string;
    value: {
      repoFullName: string;
      issues: Array<{
        id: number;
        number: number;
        title: string;
        url: string;
        labels: string[];
        state: string;
        createdAt: string;
        updatedAt?: string;
        repositoryFullName: string;
        comments: number;
      }>;
      fetchedAt: string;
    };
  };
}

const DB_NAME = "bon-vent-db";
const DB_VERSION = 3;

let dbInstance: IDBPDatabase<BonVentDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<BonVentDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<BonVentDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const companyStore = db.createObjectStore("companies", {
          keyPath: "id",
        });
        companyStore.createIndex("by-status", "status");
        companyStore.createIndex("by-favorite", "isFavorite");

        const zoneStore = db.createObjectStore("zones", { keyPath: "id" });
        zoneStore.createIndex("by-order", "order");

        const domainStore = db.createObjectStore("domains", { keyPath: "id" });
        domainStore.createIndex("by-order", "order");

        const objectiveStore = db.createObjectStore("objectives", {
          keyPath: "id",
        });
        objectiveStore.createIndex("by-type", "type");
        objectiveStore.createIndex("by-week", "weekStart");

        const interactionStore = db.createObjectStore("interactions", {
          keyPath: "id",
        });
        interactionStore.createIndex("by-type", "type");
        interactionStore.createIndex("by-date", "date");
      }

      if (oldVersion < 2) {
        const githubReposStore = db.createObjectStore("github-repos", {
          keyPath: "id",
        });
        githubReposStore.createIndex("by-added-at", "addedAt");

        db.createObjectStore("settings", { keyPath: "key" });
      }

      if (oldVersion < 3) {
        db.createObjectStore("github-issues-cache", {
          keyPath: "repoFullName",
        });
      }
    },
  });

  return dbInstance;
}
