import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Job URL", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/favoris");
    await clearIndexedDB(page);
    await seedDatabase(page);
    await page.reload();
  });

  test("displays job URL link in table", async ({ page }) => {
    const row = page.locator("tr", { hasText: "Acme Corp" });
    await expect(row.locator("a[title='Offre d\\'emploi']")).toBeVisible();
  });

  test("shows job URL field in form", async ({ page }) => {
    await page.getByRole("button", { name: "+ Ajouter" }).click();
    await expect(page.getByLabel("Lien offre")).toBeVisible();
  });

  test("saves job URL", async ({ page }) => {
    await page.getByRole("button", { name: "+ Ajouter" }).click();
    await page.getByLabel("Nom *").fill("URL Test Company");
    await page.getByLabel("Lien offre").fill("https://example.com/job/123");
    await page.getByRole("button", { name: "Ajouter" }).click();

    const row = page.locator("tr", { hasText: "URL Test Company" });
    await expect(row.locator("a[title='Offre d\\'emploi']")).toBeVisible();
  });
});
