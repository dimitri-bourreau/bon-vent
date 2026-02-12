import { test, expect } from "@playwright/test";
import { clearIndexedDB, setupWithData } from "./helpers";

test.describe("Dashboard", () => {
  test("shows stats overview", async ({ page }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await page.reload();
    await expect(page.getByText("Statistiques")).toBeVisible();
  });

  test("displays data after import", async ({ page }) => {
    await setupWithData(page, "/");
    await expect(page.getByText("À relancer")).toBeVisible();
  });

  test("displays interviews section when there are interviews", async ({
    page,
  }) => {
    await setupWithData(page, "/");

    await expect(page.getByText("Entretiens prévus")).toBeVisible();

    const interviewsTable = page.locator("section", {
      has: page.getByText("Entretiens prévus"),
    });
    await expect(
      interviewsTable.getByText("GlobalTech", { exact: true }),
    ).toBeVisible();
  });

  test("hides interviews section when there are no interviews", async ({
    page,
  }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await page.reload();

    await expect(page.getByText("Entretiens prévus")).not.toBeVisible();
  });
});
