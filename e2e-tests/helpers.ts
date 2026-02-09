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
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByTitle("Importer").click();
  const fileChooser = await fileChooserPromise;

  const buffer = Buffer.from(JSON.stringify(mockExportData));
  await fileChooser.setFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer,
  });

  await page.waitForTimeout(500);
}

export async function setupWithData(page: Page, path: string = "/") {
  await page.goto(path);
  await clearIndexedDB(page);
  await page.reload();
  await seedDatabase(page);
  await page.reload();
}
