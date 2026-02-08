import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Application Stage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/favoris");
    await clearIndexedDB(page);
    await seedDatabase(page);
    await page.reload();
  });

  test("displays application stage badges in table", async ({ page }) => {
    await expect(page.getByText("Recherche").first()).toBeVisible();
  });

  test("shows application stage selector in form", async ({ page }) => {
    await page.getByText("Acme Corp").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog").getByText("Statut")).toBeVisible();
  });

  test("changes application stage", async ({ page }) => {
    await page.getByText("TechStart").click();
    await page.locator("button", { hasText: "Recherche" }).click();
    await page.getByRole("option", { name: "Postulé" }).click();
    await page.getByRole("button", { name: "Modifier" }).click();

    const row = page.locator("tr", { hasText: "TechStart" });
    await expect(row.getByText("Postulé")).toBeVisible();
  });
});
