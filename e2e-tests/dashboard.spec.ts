import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await page.reload();
  });

  test("shows stats overview", async ({ page }) => {
    await expect(page.getByText("Statistiques")).toBeVisible();
  });

  test("displays companies after seeding", async ({ page }) => {
    await seedDatabase(page);
    await page.reload();
    await expect(page.getByText("À relancer")).toBeVisible();
  });

  test("displays overdue companies section", async ({ page }) => {
    await seedDatabase(page);
    await page.reload();
    await expect(page.getByText("À relancer")).toBeVisible();
    await expect(
      page.locator("span", { hasText: "GlobalTech" }).first(),
    ).toBeVisible();
  });
});
