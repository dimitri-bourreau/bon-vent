import { test, expect } from "@playwright/test";
import { clearIndexedDB, setupWithData } from "./helpers";

test.describe("Contacts page", () => {
  test("displays contacted companies", async ({ page }) => {
    await setupWithData(page, "/contacts");
    await expect(page.getByText("BigBank Inc")).toBeVisible();
  });

  test("displays stats sidebar", async ({ page }) => {
    await setupWithData(page, "/contacts");
    const aside = page.locator("aside");
    await expect(aside.getByText("Contactées")).toBeVisible();
  });

  test("creates contacted company", async ({ page }) => {
    await page.goto("/contacts");
    await clearIndexedDB(page);
    await page.reload();

    await page.getByRole("button", { name: "+ Ajouter" }).click();
    await page.getByLabel("Nom *").fill("New Contact");
    await page.getByRole("button", { name: "Ajouter" }).click();

    await expect(page.getByText("New Contact")).toBeVisible();
  });
});
