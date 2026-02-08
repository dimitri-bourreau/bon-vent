import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Timeline", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/favoris");
    await clearIndexedDB(page);
    await page.reload();
    await seedDatabase(page);
    await page.reload();
    await expect(page.getByText("Acme Corp")).toBeVisible();
  });

  test("displays timeline section in company form", async ({ page }) => {
    await page.locator("tr", { hasText: "Acme Corp" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Historique" }),
    ).toBeVisible();
  });

  test("shows existing timeline events", async ({ page }) => {
    await page.goto("/contacts");
    await page.reload();
    await page.locator("tr", { hasText: "BigBank Inc" }).click();
    await expect(page.getByText("Sent application email")).toBeVisible();
  });

  test("adds timeline event", async ({ page }) => {
    await page.locator("tr", { hasText: "Acme Corp" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByPlaceholder("Ajouter une note...").fill("Called recruiter");
    await page.getByPlaceholder("Ajouter une note...").press("Enter");
    await page.waitForTimeout(500);

    await page.keyboard.press("Escape");
    await page.locator("tr", { hasText: "Acme Corp" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await expect(
      page.getByRole("dialog").getByText("Called recruiter"),
    ).toBeVisible();
  });
});
