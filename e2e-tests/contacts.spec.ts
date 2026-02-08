import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Contacts page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contacts");
    await clearIndexedDB(page);
    await seedDatabase(page);
    await page.reload();
  });

  test("displays contacted companies", async ({ page }) => {
    await expect(page.getByText("BigBank Inc")).toBeVisible();
    await expect(page.getByText("Recent Contact")).toBeVisible();
  });

  test("shows favorite contacts section", async ({ page }) => {
    await expect(page.getByText("Contacts favoris")).toBeVisible();
    await expect(page.getByText("Dream Company")).toBeVisible();
  });

  test("toggles favorite on contact", async ({ page }) => {
    const row = page.locator("tr", { hasText: "Recent Contact" });
    await row.getByRole("button", { name: "☆" }).click();
    await page.waitForTimeout(500);

    await expect(page.getByText("Contacts favoris (2)")).toBeVisible();
  });

  test("creates contacted company with date", async ({ page }) => {
    await page.getByRole("button", { name: "+ Ajouter" }).click();
    await page.getByLabel("Nom *").fill("Just Contacted");
    await page.getByRole("button", { name: "Ajouter" }).click();

    await expect(page.getByText("Just Contacted")).toBeVisible();
  });
});
