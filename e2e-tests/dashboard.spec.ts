import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await page.reload();
  });

  test("shows empty state when no data", async ({ page }) => {
    await expect(page.getByText("Aucune réponse en attente")).toBeVisible();
  });

  test("displays companies after seeding", async ({ page }) => {
    await seedDatabase(page);
    await page.reload();
    await expect(
      page.getByRole("button", { name: "Recent Contact", exact: true }),
    ).toBeVisible();
  });

  test("displays overdue companies section", async ({ page }) => {
    await seedDatabase(page);
    await page.reload();
    await expect(page.getByText("À relancer")).toBeVisible();
    await expect(page.locator("span", { hasText: "GlobalTech" }).first()).toBeVisible();
  });

  test("displays waiting companies section", async ({ page }) => {
    await seedDatabase(page);
    await page.reload();
    await expect(page.getByText("Réponses en attente")).toBeVisible();
  });
});
