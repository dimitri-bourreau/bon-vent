import { Page } from "@playwright/test";
import { mockExportData } from "./mock-data";

export async function clearIndexedDB(page: Page) {
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      const req = indexedDB.deleteDatabase("bon-vent-db");
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
      req.onblocked = () => {
        setTimeout(() => resolve(), 100);
      };
    });
  });
}

export async function seedDatabase(page: Page) {
  await page.evaluate((data) => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("seedDatabase timeout")), 10000);

      const req = indexedDB.open("bon-vent-db", 1);

      req.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains("companies")) {
          const companyStore = db.createObjectStore("companies", { keyPath: "id" });
          companyStore.createIndex("by-status", "status");
          companyStore.createIndex("by-favorite", "isFavorite");
        }
        if (!db.objectStoreNames.contains("zones")) {
          const zoneStore = db.createObjectStore("zones", { keyPath: "id" });
          zoneStore.createIndex("by-order", "order");
        }
        if (!db.objectStoreNames.contains("domains")) {
          const domainStore = db.createObjectStore("domains", { keyPath: "id" });
          domainStore.createIndex("by-order", "order");
        }
        if (!db.objectStoreNames.contains("objectives")) {
          const objectiveStore = db.createObjectStore("objectives", { keyPath: "id" });
          objectiveStore.createIndex("by-type", "type");
          objectiveStore.createIndex("by-week", "weekStart");
        }
        if (!db.objectStoreNames.contains("interactions")) {
          db.createObjectStore("interactions", { keyPath: "id" });
        }
      };

      req.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const tx = db.transaction(
          ["companies", "zones", "domains", "objectives"],
          "readwrite",
        );

        for (const company of data.companies) {
          tx.objectStore("companies").put(company);
        }
        for (const zone of data.zones) {
          tx.objectStore("zones").put(zone);
        }
        for (const domain of data.domains) {
          tx.objectStore("domains").put(domain);
        }
        for (const objective of data.objectives) {
          tx.objectStore("objectives").put(objective);
        }

        tx.oncomplete = () => {
          clearTimeout(timeout);
          db.close();
          resolve();
        };
        tx.onerror = () => {
          clearTimeout(timeout);
          reject(tx.error);
        };
      };

      req.onerror = () => {
        clearTimeout(timeout);
        reject(req.error);
      };

      req.onblocked = () => {
        clearTimeout(timeout);
        reject(new Error("Database blocked"));
      };
    });
  }, mockExportData);
}

export async function waitForAppReady(page: Page) {
  await page.waitForSelector('[data-slot="checkbox"], table, h1');
}
