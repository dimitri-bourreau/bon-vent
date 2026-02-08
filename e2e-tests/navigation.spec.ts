import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigates between pages", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /Entreprises pour lesquelles/ }).click();
    await expect(page).toHaveURL("/favoris");
    await expect(page.getByText("Vos entreprises de rêve")).toBeVisible();

    await page.getByRole("link", { name: /Entreprises contactées/ }).click();
    await expect(page).toHaveURL("/contacts");
    await expect(page.getByText("Historique de vos prises de contact")).toBeVisible();

    await page.getByRole("link", { name: "Tableau de bord" }).click();
    await expect(page).toHaveURL("/");
  });

  test("displays dashboard title in header", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Tableau de bord");
  });
});
