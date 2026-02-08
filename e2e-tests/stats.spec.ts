import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Statistics", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await page.reload();
    await seedDatabase(page);
    await page.reload();
    await expect(page.getByText("Statistiques")).toBeVisible();
  });

  test("displays statistics overview", async ({ page }) => {
    await expect(page.getByText("Statistiques")).toBeVisible();
  });

  test("shows total companies count", async ({ page }) => {
    await expect(page.getByText("Total")).toBeVisible();
  });

  test("shows contacted count", async ({ page }) => {
    await expect(page.getByText("Contactées").first()).toBeVisible();
  });

  test("shows response rate", async ({ page }) => {
    await expect(page.getByText("Taux réponse")).toBeVisible();
  });
});
