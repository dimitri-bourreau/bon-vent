import { test, expect } from "@playwright/test";
import { clearIndexedDB } from "./helpers";

test.describe("GitHub Issues", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await page.reload();
  });

  test("navigates to github page", async ({ page }) => {
    await page.getByRole("link", { name: "GitHub Issues" }).click();
    await expect(page).toHaveURL("/github");
    await expect(
      page.getByText("Issues des projets open source auxquels contribuer"),
    ).toBeVisible();
  });

  test("displays empty state", async ({ page }) => {
    await page.goto("/github");
    await expect(page.getByText("Aucune issue trouvée.")).toBeVisible();
    await expect(page.getByText("Repos suivis")).toBeVisible();
    await expect(page.getByText("Issues")).toBeVisible();
  });

  test("shows token input with create link", async ({ page }) => {
    await page.goto("/github");
    await expect(page.getByPlaceholder("ghp_...")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Créer un token" }),
    ).toBeVisible();
  });

  test("shows good first issue filter", async ({ page }) => {
    await page.goto("/github");
    await expect(
      page.getByText('Afficher uniquement les "good first issue"'),
    ).toBeVisible();
  });

  test("shows error for invalid repo url", async ({ page }) => {
    await page.goto("/github");
    await page
      .getByPlaceholder("https://github.com/owner/repo")
      .fill("invalid");
    await page.getByRole("button", { name: "Ajouter" }).click();
    await expect(page.getByText("URL GitHub invalide")).toBeVisible();
  });
});
