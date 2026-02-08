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

  test("displays stats cards with correct values", async ({ page }) => {
    const aside = page.locator("aside");

    await expect(aside.getByText("Contactées")).toBeVisible();
    await expect(aside.getByText("Postulé")).toBeVisible();
    await expect(aside.getByText("En cours")).toBeVisible();
    await expect(aside.getByText("Refusé")).toBeVisible();

    const statsCards = aside.locator('[class*="text-2xl"]');
    const statsTexts = await statsCards.allTextContents();
    const statsValues = statsTexts.map((text) => parseInt(text, 10));

    expect(statsValues[0]).toBe(4);
    expect(statsValues[1]).toBe(2);
    expect(statsValues[2]).toBe(2);
    expect(statsValues[3]).toBe(0);
  });

  test("creates contacted company with date", async ({ page }) => {
    await page.getByRole("button", { name: "+ Ajouter" }).click();
    await page.getByLabel("Nom *").fill("Just Contacted");
    await page.getByRole("button", { name: "Ajouter" }).click();

    await expect(page.getByText("Just Contacted")).toBeVisible();
  });
});
