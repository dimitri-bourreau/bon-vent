import { test, expect } from "@playwright/test";
import { clearIndexedDB, setupWithData } from "./helpers";
import { mockExportData } from "./mock-data";

test.describe("Export and Import", () => {
  test("exports data", async ({ page }) => {
    await setupWithData(page, "/");

    let downloadTriggered = false;
    page.on("download", () => {
      downloadTriggered = true;
    });

    await page.locator('button[title="Exporter"]').click();
    await page.waitForTimeout(500);

    expect(downloadTriggered).toBe(true);
  });

  test("imports data", async ({ page }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await page.reload();

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
    await page.reload();

    await expect(page.getByText("À relancer")).toBeVisible();
  });
});
