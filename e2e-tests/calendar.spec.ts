import { test, expect } from "@playwright/test";
import { setupWithData } from "./helpers";

test.describe("Calendar", () => {
  test("displays calendar view", async ({ page }) => {
    await setupWithData(page, "/");
    await expect(page.getByText("Lun")).toBeVisible();
  });

  test("navigates between months", async ({ page }) => {
    await setupWithData(page, "/");
    const currentMonth = await page
      .locator("h3.capitalize")
      .first()
      .textContent();

    await page.locator("button", { hasText: "<" }).first().click();
    const prevMonth = await page.locator("h3.capitalize").first().textContent();
    expect(prevMonth).not.toBe(currentMonth);

    await page.locator("button", { hasText: ">" }).first().click();
    const nextMonth = await page.locator("h3.capitalize").first().textContent();
    expect(nextMonth).toBe(currentMonth);
  });
});
