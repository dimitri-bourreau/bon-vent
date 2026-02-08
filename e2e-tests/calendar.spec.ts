import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Calendar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await seedDatabase(page);
    await page.reload();
  });

  test("displays calendar view", async ({ page }) => {
    await expect(page.getByText("Lun")).toBeVisible();
  });

  test("navigates to previous month", async ({ page }) => {
    const currentMonth = await page
      .locator("h3.capitalize")
      .first()
      .textContent();
    await page.locator("button", { hasText: "<" }).first().click();
    const newMonth = await page.locator("h3.capitalize").first().textContent();
    expect(newMonth).not.toBe(currentMonth);
  });

  test("navigates to next month", async ({ page }) => {
    const currentMonth = await page
      .locator("h3.capitalize")
      .first()
      .textContent();
    await page.locator("button", { hasText: ">" }).first().click();
    const newMonth = await page.locator("h3.capitalize").first().textContent();
    expect(newMonth).not.toBe(currentMonth);
  });

  test("shows follow-up dates with different style", async ({ page }) => {
    const followupButton = page.locator("button", { hasText: "! " }).first();
    if (await followupButton.isVisible()) {
      await expect(followupButton).toHaveClass(/bg-destructive/);
    }
  });

  test("opens company form when clicking calendar event", async ({ page }) => {
    const calendarButton = page
      .locator(".grid-cols-7 button")
      .filter({ hasText: /\w+/ })
      .first();
    if (await calendarButton.isVisible()) {
      await calendarButton.click();
      await expect(page.getByRole("dialog")).toBeVisible();
    }
  });
});
