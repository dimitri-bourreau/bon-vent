import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigates between pages", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Favoris" }).click();
    await expect(page).toHaveURL("/favoris");
    await expect(page.getByText("Entreprises inspirantes")).toBeVisible();

    await page.getByRole("link", { name: "Contacts" }).click();
    await expect(page).toHaveURL("/contacts");
    await expect(
      page.getByText("Historique de vos prises de contact"),
    ).toBeVisible();

    await page.getByRole("link", { name: "Interactions" }).click();
    await expect(page).toHaveURL("/interactions");
    await expect(
      page.getByText("Déclarez vos échanges avec les entreprises"),
    ).toBeVisible();

    await page.getByRole("link", { name: "Tableau de bord" }).click();
    await expect(page).toHaveURL("/");
  });

  test("displays dashboard title in header", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Tableau de bord");
  });
});
