import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";
import { mockExportData } from "./mock-data";

test.describe("Export and Import", () => {
  test("exports data", async ({ page }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await seedDatabase(page);
    await page.reload();

    const downloadPromise = page.waitForEvent("download");
    await page.getByTitle("Exporter").click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain("bon-vent-backup");
    expect(download.suggestedFilename()).toContain(".json");
  });

  test("imports data", async ({ page }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await page.reload();

    await expect(page.getByText("Aucune réponse en attente")).toBeVisible();

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByTitle("Importer").click();
    const fileChooser = await fileChooserPromise;

    const buffer = Buffer.from(JSON.stringify(mockExportData));
    await fileChooser.setFiles({
      name: "backup.json",
      mimeType: "application/json",
      buffer,
    });

    await page.waitForTimeout(1000);
    await page.reload();

    await expect(
      page.getByRole("button", { name: "Recent Contact", exact: true }),
    ).toBeVisible();
  });
});
