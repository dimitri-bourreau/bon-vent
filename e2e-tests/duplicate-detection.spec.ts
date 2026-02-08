import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Duplicate Detection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/favoris");
    await clearIndexedDB(page);
    await page.reload();
    await seedDatabase(page);
    await page.reload();
    await expect(page.getByText("Acme Corp")).toBeVisible();
  });

  test("warns when adding company with similar name", async ({ page }) => {
    await page.getByRole("button", { name: "+ Ajouter" }).click();
    await page.getByLabel("Nom *").fill("Acme");
    await expect(
      page.getByText("Entreprise similaire existante"),
    ).toBeVisible();
  });

  test("shows matching company names in warning", async ({ page }) => {
    await page.getByRole("button", { name: "+ Ajouter" }).click();
    await page.getByLabel("Nom *").fill("Tech");
    await expect(
      page
        .getByText("Entreprise similaire existante")
        .filter({ hasText: "TechStart" }),
    ).toBeVisible();
  });

  test("no warning for unique name", async ({ page }) => {
    await page.getByRole("button", { name: "+ Ajouter" }).click();
    await page.getByLabel("Nom *").fill("Unique Company XYZ");
    await expect(
      page.getByText("Entreprise similaire existante"),
    ).not.toBeVisible();
  });
});
