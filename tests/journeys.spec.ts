import { test, expect, type Page } from "@playwright/test";
async function say(page: Page, text: string) {
  await page.getByLabel("Message MONO", { exact: true }).fill(text);
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
  await expect(page.getByLabel("Message MONO")).toBeVisible();
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
  await expect(page.getByLabel("Message MONO")).toBeVisible();
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
    await expect(page.getByLabel("Message MONO")).toBeVisible();
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
    await expect(page.getByLabel("Message MONO")).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.goto("/#provider");
    await page
      .getByRole("button", { name: "Add a listing", exact: true })
      .click();
    await expect(page.getByLabel("Message MONO")).toBeInViewport();
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
  await expect(page.getByLabel("Message MONO")).toBeVisible();
  await expect(tool(page)).toContainText("Legacy BMW");
  await page.goto("/#airport");
  await expect(
    page.getByLabel("Pickup location", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Message MONO")).toBeVisible();
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
