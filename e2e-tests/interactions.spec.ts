import { test, expect } from "@playwright/test";
import { clearIndexedDB, setupWithData } from "./helpers";

test.describe("Interactions page", () => {
  test("displays page header", async ({ page }) => {
    await page.goto("/interactions");
    await clearIndexedDB(page);
    await page.reload();

    await expect(
      page.getByRole("heading", { name: "Interactions" }),
    ).toBeVisible();
    await expect(
      page.getByText("Déclarez vos échanges avec les entreprises"),
    ).toBeVisible();
  });

  test("displays form elements", async ({ page }) => {
    await setupWithData(page, "/interactions");
    await expect(page.getByText("Nouvelle interaction")).toBeVisible();
    await expect(page.getByText("Entreprise *")).toBeVisible();
  });

  test("shows global history section", async ({ page }) => {
    await setupWithData(page, "/interactions");
    await expect(page.getByText("Historique global")).toBeVisible();
  });
});
