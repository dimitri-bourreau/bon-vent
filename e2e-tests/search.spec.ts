import { test, expect } from "@playwright/test";
import { setupWithData } from "./helpers";

test.describe("Search", () => {
  test("displays search bar", async ({ page }) => {
    await setupWithData(page, "/");
    await expect(page.getByPlaceholder("Rechercher...")).toBeVisible();
  });

  test("searches companies by name", async ({ page }) => {
    await setupWithData(page, "/");
    await page.getByPlaceholder("Rechercher...").fill("Acme");
    await expect(page.locator("ul").getByText("Acme Corp")).toBeVisible();
  });

  test("opens form when clicking search result", async ({ page }) => {
    await setupWithData(page, "/");
    await page.getByPlaceholder("Rechercher...").fill("Dream");
    await page.locator("ul").getByText("Dream Company").click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
