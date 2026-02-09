import { test, expect } from "@playwright/test";
import { setupWithData } from "./helpers";

test.describe("Categories", () => {
  test("displays category manager", async ({ page }) => {
    await setupWithData(page, "/");
    await expect(
      page.locator("aside").getByText("Catégories", { exact: true }),
    ).toBeVisible();
  });

  test("filters companies by category", async ({ page }) => {
    await setupWithData(page, "/favoris");
    await page.getByRole("button", { name: "Tech" }).click();

    await expect(page.getByText("Acme Corp")).toBeVisible();
    await expect(page.getByText("NoCategory Ltd")).not.toBeVisible();
  });
});
