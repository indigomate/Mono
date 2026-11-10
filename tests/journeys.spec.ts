import { test, expect, type Page } from "@playwright/test";
async function say(page: Page, text: string) {
  await page.getByLabel("Message GOMONO", { exact: true }).fill(text);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
}
const tool = (page: Page) => page.locator(".chat-tool");
test("primary actions open distinct customer and provider conversations with no dashboards", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Book a Car" }).click();
  await expect(
    page.getByRole("region", { name: "Customer conversation", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Message GOMONO")).toBeVisible();
  await expect(
    page.locator(".service-grid,.customer-overview,.provider-checklist"),
  ).toHaveCount(0);
  await expect(
    page
      .getByRole("navigation", { name: "Customer navigation", exact: true })
      .getByRole("button"),
  ).toHaveCount(1);
  await page
    .getByRole("button", { name: "Change workspace", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "I provide vehicles or services",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("region", { name: "Provider conversation", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Provider navigation", exact: true })
      .getByRole("button"),
  ).toHaveCount(1);
  await expect(page.locator("#nav-bookings,#nav-owner")).toHaveCount(0);
});
test("self-drive conversation preserves preferences and shows details and estimate inside chat", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#customer");
  await say(page, "An affordable automatic car for 3 days");
  await expect(page.locator(".match-card")).toHaveCount(1);
  await expect(tool(page)).toContainText("Toyota Corolla");
  await page.getByRole("button", { name: "View car", exact: true }).click();
  await expect(page.locator("dialog")).toHaveCount(0);
  await expect(tool(page)).toContainText("Toyota Corolla");
  await page.getByRole("button", { name: "Review rental estimate" }).click();
  await page.getByLabel("Pickup date", { exact: true }).fill("2027-02-10");
  await page.getByLabel("Return date", { exact: true }).fill("2027-02-13");
  await expect(page.locator(".quote-total")).toContainText(/1[\s,]950/);
  await page.reload();
  await expect(page.getByLabel("Pickup date", { exact: true })).toHaveValue(
    "2027-02-10",
  );
  await page.getByLabel("Your email", { exact: true }).fill("demo@example.com");
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Save demo request", exact: true })
    .click();
  await expect(tool(page)).toContainText("Toyota Corolla");
  await expect(tool(page)).toContainText("not submitted");
  await expect(page).toHaveURL(/#customer$/);
  await expect(page.getByLabel("Message GOMONO")).toBeVisible();
  await page.reload();
  await expect(tool(page)).toContainText("Toyota Corolla");
  expect(errors).toEqual([]);
});
test("conversation context handles duration without turning it into a price", async ({
  page,
}) => {
  await page.goto("/#customer");
  await say(page, "I need an SUV");
  await say(page, "Automatic please");
  await say(page, "For 3 days");
  await expect(page.locator(".match-card")).toHaveCount(1);
  await expect(tool(page)).toContainText("Range Rover");
  await expect(tool(page)).toContainText(/6[\s,]300/);
  await page.reload();
  await expect(tool(page)).toContainText("Range Rover");
});
test("whole-rental budget and inline trip edits recover an empty result", async ({
  page,
}) => {
  await page.goto("/#customer");
  await say(page, "I can spend R1500 for the whole 3 days");
  await expect(page.locator(".match-card")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Edit trip details", exact: true })
    .click();
  await page.getByLabel("Budget (ZAR)", { exact: true }).fill("2000");
  await page.getByRole("button", { name: "Update trip", exact: true }).click();
  await expect(tool(page)).toContainText("Toyota Corolla");
  await expect(tool(page)).toContainText(/1[\s,]950/);
  await expect(page).toHaveURL(/#customer$/);
});
test("over-budget dates cannot be saved as a rental request", async ({
  page,
}) => {
  await page.goto("/#customer");
  await say(page, "An affordable car under R2000 total for 3 days");
  await page.getByRole("button", { name: "View car" }).click();
  await page.getByRole("button", { name: "Review rental estimate" }).click();
  await page.getByLabel("Pickup date", { exact: true }).fill("2027-02-10");
  await page.getByLabel("Return date", { exact: true }).fill("2027-02-14");
  await expect(page.getByRole("alert")).toContainText("Over your saved");
  await expect(
    page.getByRole("button", { name: "Save demo request", exact: true }),
  ).toBeDisabled();
});
test("airport details can be collected through messages and reviewed in embedded Untitled UI fields", async ({
  page,
}) => {
  await page.goto("/#customer");
  await say(
    page,
    "I need an airport transfer from Cape Town Airport to Waterfront for 4 passengers",
  );
  await expect(page.getByLabel("Pickup location", { exact: true })).toHaveValue(
    "Cape Town Airport",
  );
  await expect(page.getByLabel("Destination", { exact: true })).toHaveValue(
    "Waterfront",
  );
  await expect(page.getByLabel("Passengers", { exact: true })).toHaveValue("4");
  await say(page, "2027-02-10");
  await say(page, "10:30");
  await say(page, "demo@example.com");
  await expect(page.getByLabel("Service date", { exact: true })).toHaveValue(
    "2027-02-10",
  );
  await expect(page.getByLabel("Your email", { exact: true })).toHaveValue(
    "demo@example.com",
  );
  await expect(
    page.locator(".service-enquiry-form .mono-field"),
  ).not.toHaveCount(0);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Save demo enquiry" }).click();
  await expect(tool(page)).toContainText("Airport transfer");
  await expect(tool(page)).toContainText("not sent");
  await expect(page).toHaveURL(/#customer$/);
});
for (const [mode, label] of [
  ["chauffeur", "Chauffeur service"],
  ["events", "Weddings & events"],
  ["group", "Group transport"],
  ["tours", "Tours & day trips"],
  ["long-term", "Long-term & subscriptions"],
  ["custom", "Something else"],
])
  test(`${label} is available and saves inside the customer conversation`, async ({
    page,
  }) => {
    await page.goto("/#customer");
    await page
      .getByRole("button", { name: "Explore services", exact: true })
      .click();
    await expect(page.locator(".chat-service-options button")).toHaveCount(8);
    await page
      .locator(".chat-service-options button")
      .filter({ hasText: label })
      .click();
    await expect(
      tool(page).getByRole("heading", { name: label + ".", exact: true }),
    ).toBeVisible();
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
    if (mode === "long-term")
      await page.getByLabel("End date", { exact: true }).fill("2027-03-10");
    else
      await page
        .getByLabel("Pickup time (Cape Town)", { exact: true })
        .fill("10:30");
    await page.getByLabel("Pickup location", { exact: true }).fill("Sea Point");
    if (mode === "group")
      await page.getByLabel("Destination", { exact: true }).fill("Waterfront");
    await page
      .getByLabel("Your email", { exact: true })
      .fill("demo@example.com");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Save demo enquiry" }).click();
    await expect(tool(page)).toContainText("Saved locally");
    await expect(page).toHaveURL(/#customer$/);
    await page.reload();
    await expect(tool(page)).toContainText(label);
    await expect(page.getByLabel("Message GOMONO")).toBeVisible();
  });
test("an airport address does not switch a chauffeur conversation to another service", async ({
  page,
}) => {
  await page.goto("/#customer");
  await say(page, "I need a chauffeur");
  await say(page, "Cape Town Airport");
  await expect(
    tool(page).getByRole("heading", {
      name: "Chauffeur service.",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByLabel("Pickup location", { exact: true })).toHaveValue(
    "Cape Town Airport",
  );
});
test("provider can add, edit and preview a listing from the same chat", async ({
  page,
}) => {
  await page.goto("/#provider");
  await say(page, "Add my BMW 320i for chauffeur at R650 per hour");
  await expect(page.getByLabel("Listing name", { exact: true })).toHaveValue(
    "BMW 320i",
  );
  await expect(
    page.getByLabel("Reference rate (ZAR)", { exact: true }),
  ).toHaveValue("650");
  await expect(
    page.getByRole("combobox", { name: "Pricing basis", exact: true }),
  ).toHaveValue("hour");
  await page
    .getByRole("button", { name: "Save listing draft", exact: true })
    .click();
  await expect(tool(page)).toContainText("BMW 320i");
  await page.getByRole("button", { name: "Edit listing", exact: true }).click();
  await expect(page.locator(".turn-user").last()).toContainText(
    "Edit BMW 320i",
  );
  await say(page, "Make it R800 per hour with 4 seats");
  await expect(
    page.getByLabel("Reference rate (ZAR)", { exact: true }),
  ).toHaveValue("800");
  await expect(
    page.getByLabel("Seats / passenger capacity", { exact: true }),
  ).toHaveValue("4");
  await page
    .getByRole("button", { name: "Save listing draft", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Add to preview", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Storefront preview", exact: true })
    .click();
  await expect(tool(page).locator(".store-item")).toContainText("BMW 320i");
  await expect(tool(page)).toContainText("/ hour");
  await expect(page).toHaveURL(/#provider$/);
  await page.reload();
  await expect(tool(page)).toContainText("BMW 320i");
});
test("provider profile fields and unfinished listing drafts resume without being silently saved", async ({
  page,
}) => {
  await page.goto("/#provider");
  await page
    .getByRole("button", { name: "Business profile", exact: true })
    .click();
  await page
    .getByLabel("Provider or business name", { exact: true })
    .fill("Cape Executive");
  await page
    .getByRole("combobox", { name: "Provider type", exact: true })
    .selectOption("chauffeur-operator");
  await page.reload();
  await expect(
    page.getByLabel("Provider or business name", { exact: true }),
  ).toHaveValue("Cape Executive");
  await page
    .getByRole("button", { name: "Save provider profile", exact: true })
    .click();
  await expect(tool(page)).toContainText("Cape Executive");
  await page
    .getByRole("button", { name: "Add a listing", exact: true })
    .first()
    .click();
  await page
    .getByLabel("Listing name", { exact: true })
    .fill("Unfinished Mercedes");
  await page.reload();
  await expect(page.getByLabel("Listing name", { exact: true })).toHaveValue(
    "Unfinished Mercedes",
  );
  await page.getByRole("button", { name: "My fleet", exact: true }).click();
  await expect(tool(page)).not.toContainText("Unfinished Mercedes");
  await say(page, "resume my draft");
  await expect(page.getByLabel("Listing name", { exact: true })).toHaveValue(
    "Unfinished Mercedes",
  );
});
test("quote-only provider rates remain quotes, and publishing is never simulated", async ({
  page,
}) => {
  await page.goto("/#provider");
  await say(page, "Add my Group shuttle as a custom quote only service");
  await page
    .getByRole("combobox", { name: "Pricing basis", exact: true })
    .selectOption("quote");
  await page
    .getByRole("button", { name: "Save listing draft", exact: true })
    .click();
  await expect(tool(page)).toContainText("Quote on request");
  await say(page, "Publish my listing");
  await expect(page.locator(".turn-text").last()).toContainText(
    "not connected",
  );
  await expect(tool(page)).toContainText("SAVED DRAFT");
});
test("customer records never appear in provider inbox and transcripts remain separate", async ({
  page,
}) => {
  await page.goto("/#customer");
  await say(page, "I need an SUV for 3 days");
  await page
    .getByRole("button", { name: "Change workspace", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "I provide vehicles or services",
      exact: true,
    })
    .click();
  await expect(page.locator(".chat-transcript")).not.toContainText(
    "I need an SUV",
  );
  await page
    .getByRole("button", { name: "Incoming requests", exact: true })
    .click();
  await expect(tool(page)).toContainText("No live requests yet.");
  await page
    .getByRole("button", { name: "Change workspace", exact: true })
    .click();
  await page
    .getByRole("button", { name: "I want to rent or ride", exact: true })
    .click();
  await expect(page.locator(".chat-transcript")).toContainText("I need an SUV");
});
test("new chat requires confirmation and preserves saved trip context", async ({
  page,
}) => {
  await page.goto("/#customer");
  await say(page, "I need an SUV for 3 days");
  await page.getByRole("button", { name: "New chat", exact: true }).click();
  await page
    .getByRole("button", { name: "Keep chatting", exact: true })
    .click();
  await expect(page.locator(".turn-user")).toHaveCount(1);
  await page.getByRole("button", { name: "New chat", exact: true }).click();
  await page
    .getByRole("button", { name: "Start new chat", exact: true })
    .click();
  await expect(page.locator(".turn-user")).toHaveCount(0);
  await page.getByRole("button", { name: "Edit my trip", exact: true }).click();
  await expect(
    page.getByRole("combobox", { name: "Vehicle type", exact: true }),
  ).toHaveValue("SUV");
});
test("earlier tools can be reopened in conversation", async ({ page }) => {
  await page.goto("/#customer");
  await say(page, "I need a BMW for 2 days");
  await page.getByRole("button", { name: "My requests", exact: true }).click();
  await page
    .getByRole("button", { name: "Reopen in chat", exact: false })
    .last()
    .click();
  await expect(tool(page)).toContainText("BMW 3 Series");
});
for (const width of [375, 768, 1440])
  test(`chat, embedded fields and composer remain usable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#customer");
    await say(page, "I need an airport transfer");
    await expect(page.getByLabel("Message GOMONO")).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.goto("/#provider");
    await page
      .getByRole("button", { name: "Add a listing", exact: true })
      .click();
    await expect(page.getByLabel("Message GOMONO")).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.getByLabel("Listing name", { exact: true }).fill("Cape shuttle");
    await page
      .getByRole("combobox", { name: "Pricing basis", exact: true })
      .selectOption("quote");
    await page
      .getByRole("button", { name: "Save listing draft", exact: true })
      .click();
    await expect(tool(page)).toContainText("Cape shuttle");
  });
test("legacy links and malformed browser data recover into chat", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("mono-customer-chat-v1", "{bad");
    localStorage.setItem("mono-provider-chat-v1", "[null,{}]");
    localStorage.setItem(
      "mono-listings",
      '[null,{"name":"Legacy BMW","price":1000,"area":"Sea Point"}]',
    );
  });
  await page.goto("/#owner");
  await expect(page.getByLabel("Message GOMONO")).toBeVisible();
  await expect(tool(page)).toContainText("Legacy BMW");
  await page.goto("/#airport");
  await expect(
    page.getByLabel("Pickup location", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Message GOMONO")).toBeVisible();
});
test("Untitled UI inputs expose labels, currency prefixes, keyboard focus and invalid states", async ({
  page,
}) => {
  await page.goto("/#provider");
  await page
    .getByRole("button", { name: "Add a listing", exact: true })
    .click();
  await expect(tool(page).locator(".mono-field")).not.toHaveCount(0);
  await expect(tool(page).locator(".mono-select")).not.toHaveCount(0);
  await expect(
    page.getByLabel("Reference rate (ZAR)", { exact: true }),
  ).toBeVisible();
  await expect(tool(page).getByText("R", { exact: true })).toBeVisible();
  await page.getByLabel("Listing name", { exact: true }).focus();
  await expect(page.getByLabel("Listing name", { exact: true })).toBeFocused();
  await page
    .getByRole("button", { name: "Save listing draft", exact: true })
    .click();
  await expect(
    page.getByLabel("Listing name", { exact: true }),
  ).toHaveAttribute("aria-invalid", "true");
  await expect(tool(page).locator(".mono-field-error").first()).not.toBeEmpty();
});

test("calendar selection updates the trip and confirmation dialog preserves focus", async ({
  page,
}) => {
  await page.goto("/#customer");
  await page.getByRole("button", { name: "Edit my trip", exact: true }).click();
  await page.getByLabel("Pickup date", { exact: true }).fill("2027-02-10");
  await page.getByLabel("Return date", { exact: true }).fill("2027-02-13");
  await expect(
    page.getByText("Choose pickup date on a calendar", { exact: true }),
  ).toBeVisible();
  const calendar = page.getByRole("application", { name: /^Pickup date,/ });
  await expect(calendar).toBeVisible();
  await calendar
    .getByRole("button", { name: "Thursday, February 11, 2027", exact: true })
    .click();
  await expect(
    page.getByLabel("Pickup date", { exact: true }).first(),
  ).toHaveValue("2027-02-11");
  await expect(
    page.getByRole("progressbar", { name: "Brief completeness" }),
  ).toHaveAttribute("aria-valuenow", "3");
  await page.getByRole("button", { name: "Update trip", exact: true }).click();
  await page.getByRole("button", { name: "New chat", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Start a fresh conversation" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Keep chatting", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "New chat", exact: true }),
  ).toBeFocused();
});

test("provider metrics and inline CTA use local records and stay in conversation", async ({
  page,
}) => {
  await page.goto("/#provider");
  await say(page, "summary");
  await expect(page.locator(".mono-metrics")).toContainText("Saved listings0");
  await page
    .getByRole("button", { name: "My fleet", exact: true })
    .last()
    .click();
  await expect(page.locator(".mono-empty")).toContainText(
    "Your collection starts here",
  );
  await page
    .getByRole("button", { name: "Add a listing →", exact: true })
    .click();
  await expect(page.getByLabel("Listing name", { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/#provider$/);
});

test("vehicle carousel controls browse sample supply without leaving chat", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/#customer");
  await say(page, "Show me cars");
  const carousel = page.getByLabel("Vehicle comparisons", { exact: true });
  await expect(carousel).toBeVisible();
  await page
    .getByRole("button", { name: "Next vehicles", exact: true })
    .click();
  await expect
    .poll(() => carousel.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
  await expect(
    page.getByLabel("Message GOMONO", { exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/#customer$/);
});

test("visible welcome and journey follow actual review without claiming payment", async ({
  page,
}) => {
  await page.goto("/#customer");
  await page.getByRole("button", { name: "Drive myself", exact: true }).click();
  await expect(
    page.locator('.journey-stages [aria-current="step"]'),
  ).toContainText("Options");
  await page
    .getByRole("button", { name: "View car", exact: true })
    .first()
    .click();
  await expect(
    page.locator('.journey-stages [aria-current="step"]'),
  ).toContainText("Review");
  await page.getByRole("button", { name: "Review rental estimate" }).click();
  await expect(
    page.getByRole("button", {
      name: "Deposit option unavailable",
      exact: true,
    }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", {
      name: "Deposit-free option unavailable",
      exact: true,
    }),
  ).toBeDisabled();
  await expect(page.getByLabel("Deposit and protection options")).toContainText(
    "does not mean zero damage liability",
  );
  await page.getByLabel("Message GOMONO", { exact: true }).fill("new trip");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.locator('.journey-stages [aria-current="step"]'),
  ).toContainText("Your brief");
  await expect(page.locator(".brief-pocket summary")).toContainText(
    "Your next journey",
  );
});

test("service brief stays editable above the composer and survives reload", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/#customer");
  await page
    .getByRole("button", { name: "Book a chauffeur", exact: true })
    .click();
  await page.getByLabel("Pickup location", { exact: true }).fill("Sea Point");
  await page.locator(".brief-pocket summary").click();
  await expect(page.locator(".brief-pocket")).toContainText("Sea Point");
  await page
    .locator(".brief-pocket-body")
    .getByRole("button", { name: "Sea Point", exact: true })
    .click();
  await expect(page.getByLabel("Pickup location", { exact: true })).toHaveValue(
    "Sea Point",
  );
  await page.reload();
  await expect(page.locator(".brief-pocket summary")).toContainText(
    "Sea Point",
  );
  const box = await page
    .getByLabel("Message GOMONO", { exact: true })
    .boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThanOrEqual(667);
  expect(
    await page.evaluate(() => document.body.scrollWidth),
  ).toBeLessThanOrEqual(375);
});

test("comparison and provider readiness actions continue their own conversation", async ({
  page,
}) => {
  await page.goto("/#customer");
  await page.getByRole("button", { name: "Drive myself", exact: true }).click();
  await page.getByText(/Compare these .* samples side by side/).click();
  await expect(page.locator(".comparison-scroll table")).toContainText(
    "Unverified",
  );
  await page.locator(".comparison-scroll").getByRole("button").first().click();
  await expect(
    page.getByLabel("Vehicle details and estimate", { exact: true }),
  ).toBeVisible();
  await page.goto("/#provider");
  await say(page, "summary");
  const readiness = page.getByLabel("Provider launch readiness", {
    exact: true,
  });
  await expect(readiness).toContainText("No verification badge is issued");
  await readiness
    .getByRole("button", { name: "Review business details →", exact: true })
    .click();
  await expect(
    page.getByLabel("Provider or business name", { exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/#provider$/);
});

test("revising a saved service brief preserves history until explicit save", async ({
  page,
}) => {
  await page.goto("/#customer");
  await say(
    page,
    "I need chauffeur from Sea Point to Waterfront on 2027-02-10 at 10:30 for 2 passengers demo@example.com",
  );
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Save demo enquiry →", exact: true })
    .click();
  await expect(page.locator(".service-inquiry-list .request-card")).toHaveCount(
    1,
  );
  await page
    .getByRole("button", {
      name: "Revise this service brief in chat →",
      exact: true,
    })
    .click();
  await expect(page.getByLabel("Pickup location", { exact: true })).toHaveValue(
    "Sea Point",
  );
  await page.getByLabel("Pickup location", { exact: true }).fill("Camps Bay");
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("mono-service-inquiries-v1") || "[]")
          .length,
    ),
  ).toBe(1);
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Save demo enquiry →", exact: true })
    .click();
  await expect(page.locator(".service-inquiry-list .request-card")).toHaveCount(
    2,
  );
  await expect(page.locator(".service-inquiry-list")).toContainText(
    "Sea Point",
  );
  await expect(page.locator(".service-inquiry-list")).toContainText(
    "Camps Bay",
  );
});

test("landing fields submit the customer intent once and preserve the existing chat", async ({
  page,
}) => {
  await page.goto("/#customer");
  await say(page, "Explore services");
  await page.locator(".home-brand").click();
  const preview = page.locator(".product-preview");
  await preview
    .getByLabel("Start your conversation", { exact: true })
    .fill("An affordable automatic car for 3 days");
  await preview
    .getByRole("button", { name: "Continue in chat →", exact: true })
    .click();
  await expect(page).toHaveURL(/#customer$/);
  await expect(tool(page)).toContainText("Toyota Corolla");
  await expect(
    page
      .locator(".turn-user")
      .filter({ hasText: "An affordable automatic car for 3 days" }),
  ).toHaveCount(1);
  await expect(
    page.locator(".turn-user").filter({ hasText: "Explore services" }),
  ).toHaveCount(1);
  await page.reload();
  await expect(
    page
      .locator(".turn-user")
      .filter({ hasText: "An affordable automatic car for 3 days" }),
  ).toHaveCount(1);
});

test("provider preview opens real editors and updates its local metrics after saving", async ({
  page,
}) => {
  await page.goto("/#experience");
  const preview = page.locator(".product-preview");
  await preview
    .getByRole("button", { name: "I provide vehicles & services", exact: true })
    .click();
  await expect(preview.locator(".mono-metrics")).toContainText(
    "Saved listings0",
  );
  await preview
    .getByLabel("Start your conversation", { exact: true })
    .fill("Add my BMW 320i for chauffeur at R650 per hour");
  await preview
    .getByRole("button", { name: "Continue in chat →", exact: true })
    .click();
  await expect(page).toHaveURL(/#provider$/);
  await expect(page.getByLabel("Listing name", { exact: true })).toHaveValue(
    "BMW 320i",
  );
  await page
    .getByRole("button", { name: "Save listing draft", exact: true })
    .click();
  await page.locator(".home-brand").click();
  await expect(preview.locator(".mono-metrics")).toContainText(
    "Saved listings1",
  );
  await preview
    .getByRole("button", { name: "Business & readiness", exact: true })
    .click();
  await expect(tool(page).locator(".mono-metrics")).toContainText(
    "Saved listings1",
  );
});

for (const width of [375, 768, 1440])
  test(`frontend components are visible and usable from landing at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page
      .getByRole("link", { name: "See the interface in action", exact: true })
      .click();
    const preview = page.locator(".product-preview");
    await expect(
      preview.getByRole("heading", { name: "Toyota Corolla", exact: true }),
    ).toBeVisible();
    await expect(
      preview.getByRole("progressbar", { name: "Brief completeness" }),
    ).toHaveAttribute("aria-valuenow", "1");
    await preview
      .getByRole("button", { name: "Preview loading animation", exact: true })
      .click();
    await expect(preview.getByRole("status")).toContainText(
      "Loading animation preview",
    );
    expect(
      await preview
        .locator(".mono-loading-mark")
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await preview
      .getByRole("button", { name: "Plan dates & budget", exact: true })
      .click();
    await expect(
      page.getByRole("application", { name: /^Pickup date,/ }),
    ).toBeVisible();
    await expect(
      page.getByLabel("Message GOMONO", { exact: true }),
    ).toBeInViewport();
  });

test("provider metrics are present without a command and start-here restores welcome", async ({
  page,
}) => {
  await page.goto("/#provider");
  await expect(tool(page).locator(".mono-metrics")).toBeVisible();
  await page
    .getByRole("button", { name: "Incoming requests", exact: true })
    .click();
  await expect(tool(page).locator(".mono-empty")).toContainText(
    "No live requests yet.",
  );
  await page.getByRole("button", { name: "Start here", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Business overview", exact: true }),
  ).toBeInViewport();
});

test("workspace load failure has a recovery action and keeps saved trip data", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  const workspaceModule =
    /\/(?:src\/workspace\/Workspace\.tsx|assets\/Workspace-[^/]+\.js)(?:\?.*)?$/;
  await page.route(workspaceModule, (route) => route.abort("failed"));
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "mono-journey-v1",
      JSON.stringify({
        trip: { location: "Cape Town", budget: 800, days: 3 },
        messages: [],
        searched: false,
      }),
    ),
  );
  const preview = page.locator(".product-preview");
  await preview
    .getByLabel("Start your conversation", { exact: true })
    .fill("An SUV for 3 days");
  await preview
    .getByRole("button", { name: "Continue in chat →", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "Your conversation couldn’t open.",
  );
  await expect(
    page.getByLabel("Your unsent message", { exact: true }),
  ).toHaveText("An SUV for 3 days");
  await page.unroute(workspaceModule);
  await page
    .getByRole("button", { name: "Reload GOMONO", exact: true })
    .click();
  await expect(
    page.getByLabel("Message GOMONO", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit my trip", exact: true }).click();
  await expect(page.getByLabel("Budget (ZAR)", { exact: true })).toHaveValue(
    "800",
  );
});

test("impossible dates in chat are rejected without breaking the calendar", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#customer");
  await say(page, "I need a chauffeur on 2027-02-31");
  await expect(page.locator(".turn-assistant").last()).toContainText(
    "invalid calendar date",
  );
  await expect(page.getByLabel("Service date", { exact: true })).toHaveValue(
    "",
  );
  await expect(
    page.getByRole("application", { name: /^Service date,/ }),
  ).toBeVisible();
  await say(page, "2027-02-28");
  await expect(page.getByLabel("Service date", { exact: true })).toHaveValue(
    "2027-02-28",
  );
  await page.reload();
  await expect(page.getByLabel("Service date", { exact: true })).toHaveValue(
    "2027-02-28",
  );
  expect(errors).toEqual([]);
});

test("invalid stored dates recover without discarding other trip preferences", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem(
      "mono-journey-v1",
      JSON.stringify({
        trip: {
          location: "Cape Town",
          start: "2027-99-99",
          end: "2027-02-31",
          budget: 900,
        },
        messages: [],
        searched: false,
      }),
    );
    localStorage.setItem(
      "mono-enquiry-draft-chauffeur",
      JSON.stringify({
        date: "2027-02-31",
        pickup: "Sea Point",
        email: "demo@example.com",
      }),
    );
  });
  await page.goto("/#customer");
  await page.getByRole("button", { name: "Edit my trip", exact: true }).click();
  await expect(page.getByLabel("Pickup date", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Budget (ZAR)", { exact: true })).toHaveValue(
    "900",
  );
  await page.goto("/#chauffeur");
  await expect(page.getByLabel("Service date", { exact: true })).toHaveValue(
    "",
  );
  await expect(page.getByLabel("Pickup location", { exact: true })).toHaveValue(
    "Sea Point",
  );
  await expect(
    page.getByRole("application", { name: /^Service date,/ }),
  ).toBeVisible();
});
