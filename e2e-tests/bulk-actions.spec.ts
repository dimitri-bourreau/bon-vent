import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";

test.describe("Bulk Actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/favoris");
    await clearIndexedDB(page);
    await seedDatabase(page);
    await page.reload();
  });

  test("shows bulk action checkbox when enabled", async ({ page }) => {
    await page.goto("/favoris?bulk=true");
    await expect(
      page.locator("thead").getByRole("checkbox"),
    ).not.toBeVisible();
  });
});
