import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Contacts page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contacts");
    await clearIndexedDB(page);
    await page.reload();
    await seedDatabase(page);
    await page.reload();
    await expect(page.getByText("BigBank Inc")).toBeVisible();
  });

  test("displays contacted companies", async ({ page }) => {
    await expect(page.getByText("BigBank Inc")).toBeVisible();
    await expect(page.getByText("Recent Contact")).toBeVisible();
  });

  test("displays stats cards with correct values", async ({ page }) => {
    const aside = page.locator("aside");

    await expect(aside.getByText("Contactées")).toBeVisible();
    await expect(aside.getByText("Postulé")).toBeVisible();
    await expect(aside.getByText("En cours")).toBeVisible();
    await expect(aside.getByText("Refusé")).toBeVisible();

    const statsValues = aside.locator("p.text-2xl");
    await expect(statsValues.nth(0)).toHaveText("4");
    await expect(statsValues.nth(1)).toHaveText("2");
    await expect(statsValues.nth(2)).toHaveText("2");
    await expect(statsValues.nth(3)).toHaveText("0");
  });

  test("creates contacted company with date", async ({ page }) => {
    await page.getByRole("button", { name: "+ Ajouter" }).click();
    await page.getByLabel("Nom *").fill("New Test Company");
    await page.getByRole("button", { name: "Ajouter" }).click();

    await expect(
      page.getByText("New Test Company", { exact: true }),
    ).toBeVisible();
  });
});
