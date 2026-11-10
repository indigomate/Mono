import { test, expect } from "@playwright/test";
test("renter request, persistence, owner listing and storefront", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Book a Car" }).click();
  await expect(
    page.getByRole("heading", { name: "Where can we take you?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Affordable cars nearby" }).click();
  await expect(page.locator(".vehicle")).toHaveCount(1);
  await page.getByRole("button", { name: "Request ↗", exact: true }).click();
  await page.getByLabel("Pickup date", { exact: true }).fill("2027-02-10");
  await page.getByLabel("Return date", { exact: true }).fill("2027-02-13");
  await page.getByLabel("Your email", { exact: true }).fill("demo@example.com");
  await page.getByRole("button", { name: "Save booking request" }).click();
  await page.locator("#nav-bookings").click();
  await expect(page.locator("#panel-view")).toContainText("R1,950");
  await page.reload();
  await expect(page.locator("#panel-view")).toContainText(
    "Demo request — not submitted",
  );
  await page.getByRole("button", { name: "Back to website" }).click();
  await page
    .getByRole("button", { name: "List Your Car", exact: false })
    .last()
    .click();
  await page.getByLabel("Vehicle name").fill("Test Mercedes");
  await page.getByLabel("Price per day").fill("1200");
  await page.getByLabel("Pickup area").fill("Waterfront");
  await page.getByRole("button", { name: "Add demo listing" }).click();
  await page.locator("#nav-store").click();
  await expect(page.locator("#panel-view")).toContainText("Test Mercedes");
  await page.reload();
  await expect(page.locator("#panel-view")).toContainText("Test Mercedes");
  expect(errors).toEqual([]);
});
for (const width of [375, 768, 1440])
  test(`responsive navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "RENT SMARTER." }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.getByRole("button", { name: "Book a Car" }).click();
    if (width < 520) {
      await page.getByRole("button", { name: "Owner", exact: true }).click();
      await expect(
        page.getByRole("heading", { name: "Your fleet. One place." }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Storefront", exact: true })
        .click();
      await expect(
        page.getByRole("heading", { name: "A storefront of your own." }),
      ).toBeVisible();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  });
test("malformed storage does not break startup", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("mono-requests", "{broken");
    localStorage.setItem("mono-listings", '[null,{"bad":true}]');
  });
  await page.goto("/#owner");
  await expect(
    page.getByRole("heading", { name: "Your fleet. One place." }),
  ).toBeVisible();
  await expect(page.locator(".stat").first()).toContainText("0");
});

test("budget limits and invalid request dates", async ({ page }) => {
  await page.goto("/#chat");
  await page.getByLabel("Message your concierge").fill("A car under R500");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator("#thread")).toContainText(
    "couldn’t find a sample vehicle",
  );
  await expect(page.locator(".vehicle")).toHaveCount(0);
  await page
    .getByLabel("Message your concierge")
    .fill("An affordable car under R1000");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByRole("button", { name: "Request ↗", exact: true }).click();
  await page.getByLabel("Pickup date", { exact: true }).fill("2027-02-13");
  await page.getByLabel("Return date", { exact: true }).fill("2027-02-10");
  await page.getByLabel("Your email", { exact: true }).fill("demo@example.com");
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Return date");
    await dialog.dismiss();
  });
  await page.getByRole("button", { name: "Save booking request" }).click();
  await expect(page.locator(".booking")).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("mono-requests")),
  ).toBeNull();
  const hero = await page.request.get("/assets/cape-town-car.jpg");
  expect(hero.ok()).toBeTruthy();
  expect(hero.headers()["content-type"]).toContain("image/jpeg");
});
