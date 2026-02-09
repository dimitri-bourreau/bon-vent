import { test, expect } from "@playwright/test";
import { clearIndexedDB } from "./helpers";

test.describe("GitHub Issues", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/github");
    await clearIndexedDB(page);
    await page.reload();
  });

  test("navigates to github page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "GitHub Issues" }).click();
    await expect(page).toHaveURL("/github");
  });

  test("displays empty state", async ({ page }) => {
    await expect(page.getByText("Aucune issue trouvée.")).toBeVisible();
  });

  test("shows token input", async ({ page }) => {
    await expect(page.getByPlaceholder("ghp_...")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Créer un token" }),
    ).toBeVisible();
  });

  test("shows good first issue filter", async ({ page }) => {
    await expect(
      page.getByText('Afficher uniquement les "good first issue"'),
    ).toBeVisible();
  });

  test("shows error for invalid repo url", async ({ page }) => {
    await page
      .getByPlaceholder("https://github.com/owner/repo")
      .fill("invalid");
    await page.getByRole("button", { name: "Ajouter" }).click();
    await expect(page.getByText("URL GitHub invalide")).toBeVisible();
  });
});
