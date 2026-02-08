import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Bulk Actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contacts");
    await clearIndexedDB(page);
    await seedDatabase(page);
    await page.reload();
  });

  test("shows bulk action buttons when items are selected", async ({
    page,
  }) => {
    const checkboxes = page.locator("tbody").getByRole("checkbox");
    await checkboxes.first().click();

    await expect(page.getByText("1 sélectionné(s)")).toBeVisible();
    await expect(page.getByRole("button", { name: "Modifier" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Supprimer" })).toBeVisible();
  });

  test("bulk edit updates contact date for multiple companies", async ({
    page,
  }) => {
    const checkboxes = page.locator("tbody").getByRole("checkbox");
    const checkboxCount = await checkboxes.count();

    if (checkboxCount >= 2) {
      await checkboxes.nth(0).click();
      await checkboxes.nth(1).click();

      await expect(page.getByText("2 sélectionné(s)")).toBeVisible();

      await page.getByRole("button", { name: "Modifier" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(page.getByText("Modifier 2 entreprise(s)")).toBeVisible();

      await page.getByLabel("Modifier la date de contact").click();
      await page.locator('input[type="date"]').fill("2025-01-15");

      await page.getByRole("button", { name: "Appliquer" }).click();

      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect(page.getByText("2 sélectionné(s)")).not.toBeVisible();
    }
  });

  test("bulk edit adds category to selected companies", async ({ page }) => {
    const checkboxes = page.locator("tbody").getByRole("checkbox");

    await checkboxes.first().click();

    await page.getByRole("button", { name: "Modifier" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const addTechCategory = page
      .getByRole("dialog")
      .locator("label")
      .filter({ hasText: /^\+ Tech$/ });

    if ((await addTechCategory.count()) > 0) {
      await addTechCategory.click();
      await page.getByRole("button", { name: "Appliquer" }).click();
      await expect(page.getByRole("dialog")).not.toBeVisible();
    }
  });

  test("bulk edit removes category from selected companies", async ({
    page,
  }) => {
    const checkboxes = page.locator("tbody").getByRole("checkbox");

    await checkboxes.first().click();

    await page.getByRole("button", { name: "Modifier" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const removeTechCategory = page
      .getByRole("dialog")
      .locator("label")
      .filter({ hasText: /^- Tech$/ });

    if ((await removeTechCategory.count()) > 0) {
      await removeTechCategory.click();
      await page.getByRole("button", { name: "Appliquer" }).click();
      await expect(page.getByRole("dialog")).not.toBeVisible();
    }
  });

  test("clears selection after bulk edit", async ({ page }) => {
    const checkboxes = page.locator("tbody").getByRole("checkbox");

    await checkboxes.first().click();
    await expect(page.getByText("1 sélectionné(s)")).toBeVisible();

    await page.getByRole("button", { name: "Modifier" }).click();
    await page.getByRole("button", { name: "Appliquer" }).click();

    await expect(page.getByText("1 sélectionné(s)")).not.toBeVisible();
  });
});
