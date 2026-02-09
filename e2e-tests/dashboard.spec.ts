import { test, expect } from "@playwright/test";
import { clearIndexedDB, setupWithData } from "./helpers";

test.describe("Dashboard", () => {
  test("shows stats overview", async ({ page }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await page.reload();
    await expect(page.getByText("Statistiques")).toBeVisible();
  });

  test("displays data after import", async ({ page }) => {
    await setupWithData(page, "/");
    await expect(page.getByText("À relancer")).toBeVisible();
  });
});
