import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Interactions page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/interactions");
    await clearIndexedDB(page);
    await seedDatabase(page);
    await page.reload();
  });

  test("displays page header", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Interactions" }),
    ).toBeVisible();
    await expect(
      page.getByText("Déclarez vos échanges avec les entreprises"),
    ).toBeVisible();
  });

  test("displays new interaction form", async ({ page }) => {
    await expect(page.getByText("Nouvelle interaction")).toBeVisible();
    await expect(page.getByText("Entreprise *")).toBeVisible();
    await expect(page.getByText("Type")).toBeVisible();
    await expect(page.getByText("Description *")).toBeVisible();
  });

  test("shows global history with existing events", async ({ page }) => {
    await expect(page.getByText("Historique global")).toBeVisible();
    await expect(page.getByText("Sent application email")).toBeVisible();
  });

  test("adds new interaction", async ({ page }) => {
    await page
      .locator("button", { hasText: "Sélectionner une entreprise" })
      .click();
    await page.getByRole("option", { name: "Acme Corp" }).click();

    await page
      .locator("form")
      .getByRole("combobox")
      .filter({ hasText: "Email reçu" })
      .click();
    await page.getByRole("option", { name: /Email envoyé/ }).click();

    await page
      .getByPlaceholder("Décrivez l'interaction...")
      .fill("Sent follow-up email");
    await page.getByRole("button", { name: "Ajouter l'interaction" }).click();

    await expect(page.getByText("Sent follow-up email")).toBeVisible();
  });

  test("companies are sorted alphabetically in select", async ({ page }) => {
    await page
      .locator("button", { hasText: "Sélectionner une entreprise" })
      .click();
    const options = page.getByRole("option");
    const firstOption = await options.first().textContent();
    const secondOption = await options.nth(1).textContent();

    expect(firstOption?.localeCompare(secondOption ?? "")).toBeLessThanOrEqual(
      0,
    );
  });
});
