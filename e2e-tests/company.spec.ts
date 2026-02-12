import { test, expect } from "@playwright/test";
import { clearIndexedDB, setupWithData } from "./helpers";

test.describe("Company CRUD", () => {
  test("shows empty state when no data", async ({ page }) => {
    await page.goto("/contacts");
    await clearIndexedDB(page);
    await page.reload();
    await expect(
      page.getByText("Aucune entreprise pour le moment"),
    ).toBeVisible();
  });

  test("creates a new company", async ({ page }) => {
    await page.goto("/contacts");
    await clearIndexedDB(page);
    await page.reload();

    await page.getByRole("button", { name: "+ Ajouter" }).click();
    await page.getByLabel("Nom *").fill("Test Company");
    await page.getByRole("button", { name: "Ajouter" }).click();

    await expect(page.locator("tr", { hasText: "Test Company" })).toBeVisible();
  });

  test("edits a company", async ({ page }) => {
    await setupWithData(page, "/contacts");
    await expect(page.getByText("Acme Corp")).toBeVisible();

    await page.locator("tr", { hasText: "Acme Corp" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByLabel("Nom *").fill("Renamed Company");
    await page.getByRole("button", { name: "Modifier" }).click();

    await expect(
      page.locator("tr", { hasText: "Renamed Company" }),
    ).toBeVisible();
  });

  test("deletes a company", async ({ page }) => {
    await setupWithData(page, "/contacts");
    await expect(page.getByText("TechStart")).toBeVisible();

    const row = page.locator("tr", { hasText: "TechStart" });
    await row.getByRole("button", { name: "Supprimer" }).click();

    await expect(page.getByRole("alertdialog")).toBeVisible();
    await page.getByRole("button", { name: "Supprimer" }).click();

    await expect(page.getByText("TechStart")).not.toBeVisible();
  });
});
