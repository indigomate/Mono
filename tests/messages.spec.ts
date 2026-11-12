import { test, expect, type Page } from "@playwright/test";
async function say(page: Page, text: string) {
  await page.getByLabel("Message GOMONO", { exact: true }).fill(text);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByRole("status", { name: "Preparing reply", exact: true }),
  ).toHaveCount(0);
}
async function remove(
  page: Page,
  message = page.locator(".conversation-turn").last(),
) {
  await message.getByRole("button", { name: /^Delete .* message$/ }).click();
  await page
    .getByRole("button", { name: "Delete message", exact: true })
    .click();
}
test("new replies reveal user, preparation, reply and tool in order on every message", async ({
  page,
}) => {
  await page.goto("/#customer");
  await expect(page.locator(".turn-assistant")).toHaveCount(1);
  await expect(
    page.getByRole("status", { name: "Preparing reply", exact: true }),
  ).toHaveCount(0);
  await page.clock.install();
  await page
    .getByLabel("Message GOMONO", { exact: true })
    .fill("Explore services");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".turn-user")).toContainText("Explore services");
  await expect(
    page.getByRole("status", { name: "Preparing reply", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".turn-assistant")).toHaveCount(1);
  await expect(page.locator(".chat-tool")).toHaveCount(0);
  await page.clock.runFor(320);
  await expect(page.locator(".turn-assistant")).toHaveCount(2);
  await expect(page.locator(".chat-tool")).toHaveCount(0);
  await page.clock.runFor(180);
  await expect(page.locator(".chat-tool")).toContainText("Airport transfer");
  await expect(
    page.getByRole("status", { name: "Preparing reply", exact: true }),
  ).toHaveCount(0);
  await page.getByLabel("Message GOMONO", { exact: true }).fill("My requests");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByRole("status", { name: "Preparing reply", exact: true }),
  ).toBeVisible();
  await page.clock.runFor(500);
  await expect(page.locator(".chat-tool")).toContainText(
    "Your next journey starts here",
  );
  await page.clock.resume();
  await page.reload();
  await expect(page.locator(".chat-history-note")).toContainText(
    "Previous conversation",
  );
  await expect(
    page.getByRole("status", { name: "Preparing reply", exact: true }),
  ).toHaveCount(0);
});

for (const role of ["customer", "provider"] as const) {
  test(`${role} deletes one message with confirmation, retains drafts and stays empty after deleting all`, async ({
    page,
  }) => {
    await page.goto(`/#${role}`);
    await expect(page.locator(".turn-assistant")).toHaveCount(1);
    await say(
      page,
      role === "customer"
        ? "I need an SUV for 3 days"
        : "Add my BMW 320i for chauffeur at R650 per hour",
    );
    if (role === "provider") {
      await page
        .getByRole("button", { name: "Save listing draft", exact: true })
        .click();
      await expect(page.locator(".chat-tool")).toContainText("BMW 320i");
      await expect(
        page.getByRole("status", { name: "Preparing reply", exact: true }),
      ).toHaveCount(0);
    }
    const keys =
      role === "customer"
        ? [
            "mono-requests",
            "mono-service-inquiries-v1",
            "mono-customer-saved-cars-v1",
          ]
        : [
            "mono-listings",
            "mono-provider-profile-v1",
            "mono-provider-listing-chat-draft-v1",
          ];
    const records = await page.evaluate(
      (keys) =>
        keys.map((key) => JSON.parse(localStorage.getItem(key) || "null")),
      keys,
    );
    const user = page.locator(".turn-user").first();
    const userId = await user.getAttribute("data-message-id");
    const count = await page.locator(".conversation-turn").count();
    await user
      .getByRole("button", { name: "Delete your message", exact: true })
      .click();
    await expect(
      page.getByRole("dialog", { name: "Delete this message?" }),
    ).toContainText("Saved requests, listings");
    await page
      .getByRole("button", { name: "Keep message", exact: true })
      .click();
    await expect(page.locator(".conversation-turn")).toHaveCount(count);
    await remove(page, user);
    await expect(
      page.getByLabel("Message GOMONO", { exact: true }),
    ).toBeFocused();
    await expect(page.locator(`[data-message-id="${userId}"]`)).toHaveCount(0);
    await expect(page.locator(".conversation-turn")).toHaveCount(count - 1);
    await page.reload();
    await expect(
      page.getByLabel("Message GOMONO", { exact: true }),
    ).toBeVisible();
    await expect(page.locator(`[data-message-id="${userId}"]`)).toHaveCount(0);
    while (await page.locator(".conversation-turn").count()) await remove(page);
    await expect(page.locator(".chat-transcript")).toContainText("No messages");
    await page.reload();
    await expect(page.locator(".chat-transcript")).toContainText("No messages");
    await expect(page.locator(".conversation-turn")).toHaveCount(0);
    expect(
      await page.evaluate(
        (keys) =>
          keys.map((key) => JSON.parse(localStorage.getItem(key) || "null")),
        keys,
      ),
    ).toEqual(records);
    if (role === "provider") {
      await say(page, "My fleet");
      await expect(page.locator(".chat-tool")).toContainText("BMW 320i");
    }
  });
}

test("deleting latest reply does not resurrect an older form and clear cancels queued presentation", async ({
  page,
}) => {
  await page.goto("/#customer");
  await say(page, "Edit my trip");
  await say(page, "Explore services");
  await remove(page);
  await expect(page.locator(".chat-tool")).toHaveCount(0);
  // Removing the now-last user turn exposes the earlier assistant, still archived.
  await remove(page);
  await expect(page.locator(".chat-tool")).toHaveCount(0);
  await expect(page.locator(".past-tool")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".chat-tool")).toHaveCount(0);
  await expect(page.locator(".past-tool")).toHaveCount(1);
  await page.getByLabel("Message GOMONO", { exact: true }).fill("My requests");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await page
    .getByRole("button", { name: "Conversation actions", exact: true })
    .click();
  await page.getByRole("menuitem", { name: "Clear chat", exact: true }).click();
  await page.getByRole("button", { name: "Clear chat", exact: true }).click();
  await expect(
    page.getByRole("status", { name: "Preparing reply", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator(".conversation-turn")).toHaveCount(1);
  await expect(page.locator(".turn-user")).toHaveCount(0);
  await expect(page.locator(".chat-tool")).toHaveCount(0);
});

test("reduced motion preserves the reply sequence without moving animations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#customer");
  await expect(page.locator(".turn-assistant")).toHaveCount(1);
  await page.clock.install();
  await page
    .getByLabel("Message GOMONO", { exact: true })
    .fill("Explore services");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  const pending = page.getByRole("status", {
    name: "Preparing reply",
    exact: true,
  });
  await expect(pending).toBeVisible();
  expect(
    await pending
      .locator(".gomono-load")
      .evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await page.clock.runFor(120);
  await expect(page.locator(".chat-tool")).toBeVisible();
  expect(
    await page
      .locator(".turn-assistant")
      .last()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.clock.resume();
});
