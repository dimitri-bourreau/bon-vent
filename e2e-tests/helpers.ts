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

async function trySeedDatabase(page: Page): Promise<boolean> {
  return page.evaluate((data) => {
    return new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => resolve(false), 3000);

      const req = indexedDB.open("bon-vent-db", 1);

      req.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains("companies")) {
          const companyStore = db.createObjectStore("companies", {
            keyPath: "id",
          });
          companyStore.createIndex("by-status", "status");
          companyStore.createIndex("by-favorite", "isFavorite");
        }
        if (!db.objectStoreNames.contains("zones")) {
          const zoneStore = db.createObjectStore("zones", { keyPath: "id" });
          zoneStore.createIndex("by-order", "order");
        }
        if (!db.objectStoreNames.contains("domains")) {
          const domainStore = db.createObjectStore("domains", {
            keyPath: "id",
          });
          domainStore.createIndex("by-order", "order");
        }
        if (!db.objectStoreNames.contains("objectives")) {
          const objectiveStore = db.createObjectStore("objectives", {
            keyPath: "id",
          });
          objectiveStore.createIndex("by-type", "type");
          objectiveStore.createIndex("by-week", "weekStart");
        }
        if (!db.objectStoreNames.contains("interactions")) {
          db.createObjectStore("interactions", { keyPath: "id" });
        }
      };

      req.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        const storeNames = ["companies", "zones", "domains", "objectives"];
        const availableStores = storeNames.filter((name) =>
          db.objectStoreNames.contains(name),
        );

        if (availableStores.length === 0) {
          clearTimeout(timeout);
          db.close();
          resolve(true);
          return;
        }

        const tx = db.transaction(availableStores, "readwrite");

        if (availableStores.includes("companies")) {
          for (const company of data.companies) {
            tx.objectStore("companies").put(company);
          }
        }
        if (availableStores.includes("zones")) {
          for (const zone of data.zones) {
            tx.objectStore("zones").put(zone);
          }
        }
        if (availableStores.includes("domains")) {
          for (const domain of data.domains) {
            tx.objectStore("domains").put(domain);
          }
        }
        if (availableStores.includes("objectives")) {
          for (const objective of data.objectives) {
            tx.objectStore("objectives").put(objective);
          }
        }

        tx.oncomplete = () => {
          clearTimeout(timeout);
          db.close();
          resolve(true);
        };
        tx.onerror = () => {
          clearTimeout(timeout);
          db.close();
          resolve(false);
        };
      };

      req.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };

      req.onblocked = () => {
        clearTimeout(timeout);
        resolve(false);
      };
    });
  }, mockExportData);
}

export async function seedDatabase(page: Page) {
  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    const success = await trySeedDatabase(page);
    if (success) return;
    await page.waitForTimeout(500);
  }
  throw new Error("seedDatabase failed after retries");
}

export async function waitForAppReady(page: Page) {
  await page.waitForSelector('[data-slot="checkbox"], table, h1');
}
