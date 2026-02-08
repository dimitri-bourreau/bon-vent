import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Categories", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await page.reload();
    await seedDatabase(page);
    await page.reload();
  });

  test("displays category manager", async ({ page }) => {
    await expect(page.locator("aside").getByText("Catégories", { exact: true })).toBeVisible();
  });

  test("creates a new category", async ({ page }) => {
    await page.getByPlaceholder("Nouvelle catégorie...").fill("Healthcare");
    await page.getByPlaceholder("Nouvelle catégorie...").press("Enter");

    await expect(page.locator("span.flex-1", { hasText: "Healthcare" })).toBeVisible();
  });

  test("deletes a category", async ({ page }) => {
    const categoryList = page.locator("div.space-y-2").filter({ has: page.locator("span.flex-1") });
    const remoteRow = categoryList.locator("div.flex").filter({ hasText: "Remote" }).first();
    await remoteRow.getByRole("button", { name: "×" }).click();

    await page.getByRole("button", { name: "Supprimer" }).click();
    await expect(page.locator("span.flex-1", { hasText: "Remote" })).not.toBeVisible();
  });

  test("filters companies by category on favoris page", async ({ page }) => {
    await page.goto("/favoris");
    await page.getByRole("button", { name: "Tech" }).click();

    await expect(page.getByText("Acme Corp")).toBeVisible();
    await expect(page.getByText("TechStart")).toBeVisible();
    await expect(page.getByText("NoCategory Ltd")).not.toBeVisible();
  });
});
