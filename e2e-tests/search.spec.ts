import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await seedDatabase(page);
    await page.reload();
  });

  test("displays search bar on homepage", async ({ page }) => {
    await expect(page.getByPlaceholder("Rechercher...")).toBeVisible();
  });

  test("searches companies by name", async ({ page }) => {
    await page.getByPlaceholder("Rechercher...").fill("Acme");
    await expect(page.locator("ul").getByText("Acme Corp")).toBeVisible();
  });

  test("searches companies by category", async ({ page }) => {
    await page.getByPlaceholder("Rechercher...").fill("Finance");
    await expect(page.locator("ul").getByText("BigBank Inc")).toBeVisible();
  });

  test("opens company form when clicking search result", async ({ page }) => {
    await page.getByPlaceholder("Rechercher...").fill("Dream");
    await page.locator("ul").getByText("Dream Company").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel("Nom *")).toHaveValue("Dream Company");
  });
});
