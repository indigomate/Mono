import { test, expect, type Page } from "@playwright/test";
async function say(page: Page, text: string) {
  await page.getByLabel("Message your concierge").fill(text);
  await page.getByRole("button", { name: "Send message" }).click();
}
async function quote(page: Page) {
  await page.getByRole("button", { name: "View car" }).first().click();
  await page.getByRole("button", { name: "Review rental estimate" }).click();
}
test("renter reviews estimate, saves request and resumes after reload", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Book a Car" }).click();
  await page.locator(".service-self-drive").click();
  await expect(
    page.getByRole("heading", { name: /Where can we/ }),
  ).toBeVisible();
  await say(page, "An affordable automatic car for 3 days");
  await expect(page.locator(".match-card")).toHaveCount(1);
  await quote(page);
  await page.getByLabel("Pickup date", { exact: true }).fill("2027-02-10");
  await page.getByLabel("Return date", { exact: true }).fill("2027-02-13");
  await expect(page.locator(".quote-total")).toContainText(/1[\s,]950/);
  await page.getByLabel("Your email", { exact: true }).fill("demo@example.com");
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Save demo request", exact: true })
    .click();
  await expect(page.locator(".success-note[role=status]")).toContainText(
    "Demo request saved",
  );
  await page.getByRole("button", { name: "View my requests" }).click();
  await expect(page.locator(".request-card")).toContainText("Toyota Corolla");
  await expect(page.locator(".request-card")).toContainText("Not sent");
  await page.reload();
  await expect(page.locator(".request-card")).toContainText(/1[\s,]950/);
  await page.locator("#nav-chat").click();
  await expect(page.locator(".chat-message.user")).toContainText(
    "affordable automatic",
  );
  await expect(page.locator(".trip-card")).toContainText("2027-02-10");
  expect(errors).toEqual([]);
});
test("follow-ups preserve vehicle and transmission and duration is not interpreted as budget", async ({
  page,
}) => {
  await page.goto("/#chat");
  await say(page, "I need an SUV");
  await say(page, "Automatic please");
  await say(page, "For 3 days");
  await expect(page.locator(".match-card")).toHaveCount(1);
  await expect(page.locator(".match-card")).toContainText("Range Rover");
  await expect(page.locator(".trip-card")).toContainText("3 days");
  await expect(page.locator(".trip-card")).toContainText("Not set");
  await page.reload();
  await expect(page.locator(".match-card")).toHaveCount(1);
  await expect(page.locator(".trip-card")).toContainText("Automatic");
});
test("total rental budget filters trip price and empty search recovers via editable brief", async ({
  page,
}) => {
  await page.goto("/#chat");
  await say(page, "I can spend R1500 for the whole 3 days");
  await expect(page.locator(".match-card")).toHaveCount(0);
  await expect(page.locator(".trip-card")).toContainText("total");
  await page.getByRole("button", { name: "Adjust trip" }).click();
  await page.getByLabel("Budget (ZAR)", { exact: true }).fill("2000");
  await page.getByRole("button", { name: "Update trip" }).click();
  await expect(page.locator(".match-card")).toHaveCount(1);
  await expect(page.locator(".match-card")).toContainText("Toyota Corolla");
  await expect(page.locator(".match-card")).toContainText(/1[\s,]950/);
});
test("quote rejects invalid dates and budget overruns", async ({ page }) => {
  await page.goto("/#chat");
  await say(page, "An affordable car under R2000 total for 3 days");
  await quote(page);
  await page.getByLabel("Pickup date", { exact: true }).fill("2027-02-13");
  await page.getByLabel("Return date", { exact: true }).fill("2027-02-10");
  await expect(
    page.getByRole("button", { name: "Save demo request", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Return date", { exact: true }).fill("2027-02-17");
  await expect(page.getByRole("alert")).toContainText(
    "Over your saved whole-rental budget",
  );
  await expect(
    page.getByRole("button", { name: "Save demo request", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Close vehicle review" }).click();
  await expect(page.locator("dialog")).toHaveCount(0);
});
test("owner creates, edits and controls local storefront preview", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "List Your Car" }).last().click();
  await page.locator("#nav-owner").click();
  await page.getByRole("button", { name: "Create first listing" }).click();
  await page
    .getByLabel("Listing name", { exact: true })
    .fill("Mercedes C-Class");
  await page.getByLabel("Reference rate (ZAR)", { exact: true }).fill("1200");
  await page.getByLabel("Service area", { exact: true }).fill("Waterfront");
  await page.getByRole("button", { name: "Save listing draft" }).click();
  await expect(page.locator(".draft-card")).toContainText("Mercedes C-Class");
  await page.getByRole("button", { name: "Edit listing", exact: true }).click();
  await page.getByLabel("Listing name", { exact: true }).fill("Mercedes C200");
  await page.getByRole("button", { name: "Save listing draft" }).click();
  await page
    .getByRole("button", { name: "Add to preview", exact: true })
    .click();
  await page.getByRole("button", { name: "Preview storefront" }).click();
  await expect(page.locator(".store-item")).toContainText("Mercedes C200");
  await page.reload();
  await expect(page.locator(".store-item")).toContainText("Mercedes C200");
  await page.locator("#nav-owner").click();
  await page.getByRole("button", { name: "Remove from preview" }).click();
  await page.locator("#nav-store").click();
  await expect(page.locator(".store-item")).toHaveCount(0);
  await expect(
    page.getByText("Your collection starts with a draft."),
  ).toBeVisible();
});
for (const width of [375, 768, 1440])
  test(`responsive workflow at ${width}px`, async ({ page }) => {
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
    await page.locator(".service-self-drive").click();
    await say(page, "An SUV for 3 days");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await quote(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.getByRole("button", { name: "Close vehicle review" }).click();
    await page
      .getByRole("button", { name: "Change workspace", exact: true })
      .click();
    await page.locator(".workspace-choice-grid button").nth(1).click();
    if (width < 520) {
      const nav = page.getByRole("navigation", {
        name: "Mobile provider navigation",
      });
      await nav
        .getByRole("button", { name: "Vehicles & services", exact: true })
        .click();
      await expect(
        nav.getByRole("button", { name: "Vehicles & services", exact: true }),
      ).toHaveAttribute("aria-current", "page");
    } else await page.locator("#nav-owner").click();
    await expect(
      page.getByRole("heading", { name: "Your vehicles & services." }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  });
test("corrupt storage and legacy owner listings recover safely", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("mono-journey-v1", "{bad");
    localStorage.setItem("mono-requests", "{bad");
    localStorage.setItem(
      "mono-listings",
      '[null,{"name":"Legacy BMW","price":1000,"area":"Sea Point"}]',
    );
  });
  await page.goto("/#owner");
  await expect(page.locator(".draft-card")).toContainText("Legacy BMW");
  await page.goto("/#bookings");
  await expect(
    page.getByRole("heading", { name: "Your next trip is waiting." }),
  ).toBeVisible();
});
test("new trip clears context and browser back restores view", async ({
  page,
}) => {
  await page.goto("/#chat");
  await say(page, "An SUV under R7000 total for 3 days");
  await page.getByRole("button", { name: "Start a new trip" }).click();
  await expect(page.locator(".chat-message")).toHaveCount(0);
  await expect(page.locator(".trip-card")).toContainText("Not set");
  await page.locator("#nav-customer").click();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: /Where can we/ }),
  ).toBeVisible();
});

test("make preferences survive follow-ups and modal supports Escape", async ({
  page,
}) => {
  await page.goto("/#chat");
  await say(page, "Show me BMW cars");
  await say(page, "For 2 days");
  await expect(page.locator(".match-card")).toHaveCount(1);
  await expect(page.locator(".match-card")).toContainText("BMW");
  await page.getByRole("button", { name: "View car" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "View car" })).toBeFocused();
});
test("total budget without duration asks for missing detail and unsupported location shows no cars", async ({
  page,
}) => {
  await page.goto("/#chat");
  await say(page, "My total budget is R5000");
  await expect(page.locator(".match-card")).toHaveCount(0);
  await expect(page.getByRole("log")).toContainText(
    "Add your dates or number of days",
  );
  await page.getByRole("button", { name: "Edit trip", exact: true }).click();
  await page.getByLabel("Pickup city").fill("Johannesburg");
  await page.getByRole("button", { name: "Update trip" }).click();
  await expect(page.locator(".match-card")).toHaveCount(0);
  await expect(page.getByRole("log")).toContainText("Cape Town only");
});

test("unavailable storage warns and retains progress while navigating in the same session", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    };
  });
  await page.goto("/#chat");
  await say(page, "I need an SUV for 3 days");
  await expect(page.locator("#storage-status")).toContainText(
    "storage is unavailable",
  );
  await page
    .getByRole("button", { name: "Back to website", exact: true })
    .click();
  await page.getByRole("button", { name: "Book a Car" }).click();
  await page.locator(".service-self-drive").click();
  await expect(page.locator(".trip-card")).toContainText("SUV");
  await expect(page.locator(".chat-message.user")).toContainText("3 days");
});

test("customer and provider dashboards have separate navigation and preserve data across explicit switching", async ({
  page,
}) => {
  await page.goto("/#customer");
  await expect(page.locator(".service-card")).toHaveCount(8);
  await expect(
    page.getByRole("navigation", { name: "Customer navigation", exact: true }),
  ).toContainText("My requests");
  await expect(page.locator("#nav-owner")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Change workspace", exact: true })
    .click();
  await page.locator(".workspace-choice-grid button").nth(1).click();
  await expect(
    page.getByRole("navigation", { name: "Provider navigation", exact: true }),
  ).toContainText("Incoming requests");
  await expect(page.locator("#nav-chat")).toHaveCount(0);
  await expect(page.locator("#nav-bookings")).toHaveCount(0);
  await expect(page.locator(".provider-checklist")).toBeVisible();
});
for (const mode of [
  "chauffeur",
  "airport",
  "events",
  "group",
  "tours",
  "long-term",
  "custom",
])
  test(`${mode} service enquiry uses the correct fields and saves only in customer workspace`, async ({
    page,
  }) => {
    await page.goto(`/#${mode}`);
    await expect(page.locator(".service-enquiry-form")).toBeVisible();
    await page
      .getByLabel("Vehicle preference", { exact: true })
      .selectOption(
        mode === "group"
          ? "Van / minibus"
          : mode === "custom"
            ? "Motorcycle"
            : "Sedan",
      );
    await page
      .getByLabel(mode === "long-term" ? "Start date" : "Service date", {
        exact: true,
      })
      .fill("2027-02-10");
    if (mode === "long-term") {
      await expect(
        page.getByLabel("Pickup time (Cape Town)", { exact: true }),
      ).toHaveCount(0);
      await page.getByLabel("End date", { exact: true }).fill("2027-03-10");
    } else
      await page
        .getByLabel("Pickup time (Cape Town)", { exact: true })
        .fill("10:30");
    await page
      .getByLabel("Pickup location", { exact: true })
      .fill("Cape Town Airport");
    await page
      .getByLabel(
        mode === "airport" || mode === "group"
          ? "Destination"
          : "Destination or itinerary (optional)",
        { exact: true },
      )
      .fill("Waterfront");
    if (mode === "chauffeur")
      await page.getByLabel("Driver hours required", { exact: true }).fill("4");
    await page
      .getByLabel("Your email", { exact: true })
      .fill("demo@example.com");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Save demo enquiry" }).click();
    await expect(page.locator(".success-note")).toContainText(
      "Service enquiry saved",
    );
    await page.getByRole("button", { name: "View my requests" }).click();
    await expect(
      page.locator(".service-inquiry-list .request-card"),
    ).toHaveCount(1);
    await page.reload();
    await expect(page.locator(".service-inquiry-list")).toContainText(
      "Cape Town Airport",
    );
    await page.goto("/#provider-requests");
    await expect(
      page.getByRole("heading", { name: "No live requests yet." }),
    ).toBeVisible();
    await expect(page.locator(".service-inquiry-list")).toHaveCount(0);
  });
test("provider profile and chauffeur offering support hourly pricing and persist independently", async ({
  page,
}) => {
  await page.goto("/#provider-profile");
  await page
    .getByLabel("Provider or business name", { exact: true })
    .fill("Cape Executive Transport");
  await page
    .getByLabel("Provider type", { exact: true })
    .selectOption("chauffeur-operator");
  await page.getByLabel("Self-drive rental", { exact: true }).uncheck();
  await page.getByLabel("Chauffeur service", { exact: true }).check();
  await page.getByLabel("Airport transfer", { exact: true }).check();
  await page.getByRole("button", { name: "Save provider profile" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Provider profile saved" }),
  ).toBeVisible();
  await page.locator("#nav-owner").click();
  await page.getByRole("button", { name: "Create first listing" }).click();
  await page
    .getByLabel("Listing name", { exact: true })
    .fill("Executive Mercedes");
  await page.getByLabel("Service area", { exact: true }).fill("Cape Town");
  await expect(page.getByLabel("Pricing basis", { exact: true })).toHaveValue(
    "hour",
  );
  await page.getByLabel("Reference rate (ZAR)", { exact: true }).fill("650");
  await page.getByRole("button", { name: "Save listing draft" }).click();
  await expect(page.locator(".draft-card")).toContainText("/ hour");
  await expect(page.locator(".draft-card")).toContainText("Chauffeur service");
  await page
    .getByRole("button", { name: "Add to preview", exact: true })
    .click();
  await page.locator("#nav-store").click();
  await expect(page.locator(".storefront-hero")).toContainText(
    "Cape Executive Transport",
  );
  await expect(page.locator(".store-item")).toContainText("/ hour");
  await page.reload();
  await expect(page.locator(".store-item")).toContainText("Executive Mercedes");
  await page.goto("/#customer");
  await expect(page.locator(".customer-overview")).toContainText(
    "Saved rental requests0",
  );
  await expect(page.locator(".draft-card")).toHaveCount(0);
});
test("service enquiry draft resumes without becoming a submitted request", async ({
  page,
}) => {
  await page.goto("/#airport");
  await page
    .getByLabel("Pickup location", { exact: true })
    .fill("Airport terminal");
  await page.getByLabel("Destination", { exact: true }).fill("Sea Point");
  await page.reload();
  await expect(page.getByLabel("Pickup location", { exact: true })).toHaveValue(
    "Airport terminal",
  );
  await expect(page.getByLabel("Destination", { exact: true })).toHaveValue(
    "Sea Point",
  );
  await page.goto("/#bookings");
  await expect(page.locator(".service-inquiry-list")).toHaveCount(0);
});
test("explicit chauffeur intent goes to its dedicated enquiry, not daily car quotes", async ({
  page,
}) => {
  await page.goto("/#chat");
  await say(page, "I need a chauffeur for the day");
  await expect(page).toHaveURL(/#chauffeur$/);
  await expect(page.locator(".service-enquiry-form")).toBeVisible();
  await expect(page.locator(".match-card")).toHaveCount(0);
});
for (const width of [375, 768, 1440])
  test(`separate dashboards and service forms fit ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const view of [
      "customer",
      "provider",
      "provider-profile",
      "chauffeur",
      "long-term",
    ]) {
      await page.goto(`/#${view}`);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        view,
      ).toBeTruthy();
    }
    await page.goto("/#workspaces");
    await expect(page.locator(".workspace-choice-grid button")).toHaveCount(2);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  });

test("unsupported vehicle preference carries into a custom enquiry", async ({
  page,
}) => {
  await page.goto("/#chat");
  await say(page, "I need a motorcycle");
  await expect(page.locator(".match-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Prepare a custom enquiry" }).click();
  await expect(page).toHaveURL(/#custom$/);
  await expect(
    page.getByLabel("Vehicle preference", { exact: true }),
  ).toHaveValue("Motorcycle");
  await expect(
    page.getByLabel("Driver arrangement", { exact: true }),
  ).toHaveValue("flexible");
});
test("quote-only provider listing persists without inventing a zero-price rental", async ({
  page,
}) => {
  await page.goto("/#owner");
  await page.getByRole("button", { name: "Create first listing" }).click();
  await page.getByLabel("Listing name", { exact: true }).fill("Group charter");
  await page
    .getByLabel("Vehicle category", { exact: true })
    .selectOption("Van / minibus");
  await page.getByLabel("Service area", { exact: true }).fill("Cape Town");
  await page.getByLabel("Pricing basis", { exact: true }).selectOption("quote");
  await page.getByLabel("Group transport", { exact: true }).check();
  await expect(
    page.getByLabel("Reference rate (ZAR)", { exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Save listing draft" }).click();
  await expect(page.locator(".draft-card")).toContainText("Quote on request");
  await page.reload();
  await expect(page.locator(".draft-card")).toContainText("Quote on request");
  await expect(page.locator(".draft-card")).not.toContainText("/ day");
});
