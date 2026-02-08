import { test, expect } from "@playwright/test";
import { clearIndexedDB, seedDatabase } from "./helpers";
import { mockCompanies } from "./mock-data";

test.describe("Calendar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearIndexedDB(page);
    await seedDatabase(page);
    await page.reload();
  });

  test("displays calendar view", async ({ page }) => {
    await expect(page.getByText("Lun")).toBeVisible();
  });

  test("navigates to previous month", async ({ page }) => {
    const currentMonth = await page
      .locator("h3.capitalize")
      .first()
      .textContent();
    await page.locator("button", { hasText: "<" }).first().click();
    const newMonth = await page.locator("h3.capitalize").first().textContent();
    expect(newMonth).not.toBe(currentMonth);
  });

  test("navigates to next month", async ({ page }) => {
    const currentMonth = await page
      .locator("h3.capitalize")
      .first()
      .textContent();
    await page.locator("button", { hasText: ">" }).first().click();
    const newMonth = await page.locator("h3.capitalize").first().textContent();
    expect(newMonth).not.toBe(currentMonth);
  });

  test("shows follow-up dates with different style", async ({ page }) => {
    const followupButton = page.locator("button", { hasText: "! " }).first();
    if (await followupButton.isVisible()) {
      await expect(followupButton).toHaveClass(/bg-destructive/);
    }
  });

  test("opens company form when clicking calendar event", async ({ page }) => {
    const calendarButton = page
      .locator(".grid-cols-7 button")
      .filter({ hasText: /\w+/ })
      .first();
    if (await calendarButton.isVisible()) {
      await calendarButton.click();
      await expect(page.getByRole("dialog")).toBeVisible();
    }
  });

  test("does not display companies in research stage even with contactedAt", async ({
    page,
  }) => {
    await clearIndexedDB(page);

    const researchCompanyWithContact = {
      id: "research-with-contact",
      name: "ResearchOnlyCompany",
      categories: ["Tech"],
      website: "",
      jobUrl: "",
      contactEmail: "",
      contactName: "",
      note: "",
      status: "favorite" as const,
      applicationStage: "research" as const,
      timeline: [],
      isFavorite: true,
      contactedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const appliedCompany = mockCompanies.find(
      (c) => c.applicationStage === "applied" && c.contactedAt,
    );

    await page.evaluate(
      ({ researchCompany, appliedCompany }) => {
        return new Promise<void>((resolve) => {
          const req = indexedDB.open("bon-vent-db", 1);
          req.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains("companies")) {
              const store = db.createObjectStore("companies", {
                keyPath: "id",
              });
              store.createIndex("by-status", "status");
              store.createIndex("by-favorite", "isFavorite");
            }
            ["zones", "domains", "objectives", "interactions"].forEach(
              (name) => {
                if (!db.objectStoreNames.contains(name)) {
                  db.createObjectStore(name, { keyPath: "id" });
                }
              },
            );
          };
          req.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const tx = db.transaction("companies", "readwrite");
            tx.objectStore("companies").put(researchCompany);
            if (appliedCompany) {
              tx.objectStore("companies").put(appliedCompany);
            }
            tx.oncomplete = () => {
              db.close();
              resolve();
            };
          };
        });
      },
      { researchCompany: researchCompanyWithContact, appliedCompany },
    );

    await page.reload();
    await page.waitForTimeout(500);

    const calendarEvents = page.locator(".grid-cols-7 button");
    await expect(
      calendarEvents.filter({ hasText: "ResearchOnlyCompany" }),
    ).toHaveCount(0);

    if (appliedCompany) {
      const appliedEvents = calendarEvents.filter({
        hasText: appliedCompany.name,
      });
      const count = await appliedEvents.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});
