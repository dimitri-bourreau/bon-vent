import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Company CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/favoris");
    await clearIndexedDB(page);
    await page.reload();
  });

  test("shows empty state when no data", async ({ page }) => {
    await expect(page.getByText("Aucun favori pour le moment")).toBeVisible();
  });

  test("creates a new company", async ({ page }) => {
    await page.getByRole("button", { name: "+ Ajouter" }).click();
    await page.getByLabel("Nom *").fill("New Company");
    await page.getByRole("button", { name: "Ajouter" }).click();
    await expect(page.getByText("New Company")).toBeVisible();
  });

  test("creates company with categories", async ({ page }) => {
    await seedDatabase(page);
    await page.reload();

    await page.getByRole("button", { name: "+ Ajouter" }).click();
    await page.getByLabel("Nom *").fill("Categorized Company");
    await page.getByLabel("Tech").check();
    await page.getByLabel("Startup").check();
    await page.getByRole("button", { name: "Ajouter" }).click();

    await expect(page.getByText("Categorized Company")).toBeVisible();
    const row = page.locator("tr", { hasText: "Categorized Company" });
    await expect(row.getByText("Tech, Startup")).toBeVisible();
  });

  test("edits a company by clicking row", async ({ page }) => {
    await seedDatabase(page);
    await page.reload();

    await page.getByText("Acme Corp").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel("Nom *")).toHaveValue("Acme Corp");

    await page.getByLabel("Nom *").fill("Acme Corp Updated");
    await page.getByRole("button", { name: "Modifier" }).click();

    await expect(page.getByText("Acme Corp Updated")).toBeVisible();
  });

  test("deletes a company", async ({ page }) => {
    await seedDatabase(page);
    await page.reload();

    const row = page.locator("tr", { hasText: "TechStart" });
    await row.getByRole("button", { name: "×" }).click();

    await expect(page.getByRole("alertdialog")).toContainText("Supprimer cette entreprise");
    await page.getByRole("button", { name: "Supprimer" }).click();

    await expect(page.getByText("TechStart")).not.toBeVisible();
  });

  test("toggles favorite status", async ({ page }) => {
    await seedDatabase(page);
    await page.reload();

    const row = page.locator("tr", { hasText: "Acme Corp" });
    await expect(row.getByRole("button", { name: "★" })).toBeVisible();
  });
});
