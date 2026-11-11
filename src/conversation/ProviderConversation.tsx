import { CompletionFeedback } from "../components/ui/CompletionFeedback";
import { ProviderPlans } from "./ProviderPlans";
import { ProviderContext } from "./JourneyContext";
import {
  EmptyState,
  LocalMetrics,
} from "../components/ui/ConversationElements";
import { useEffect, useRef, useState } from "react";
import { loadDrafts, saveDemo, type Draft } from "../demo/marketplace";
import {
  loadProfile,
  isService,
  type ProviderProfile,
  type ServiceType,
} from "../demo/services";
import { read } from "../demo/storage";
import { type ProviderView } from "../workspace/navigation";
import { ChatSurface } from "./ChatSurface";
import {
  ListingCard,
  ProfileCard,
  FleetCards,
  StorefrontCard,
} from "./ProviderCards";
import { loadTurns, turn, type ChatTool } from "./model";
function initialTool(view: ProviderView): ChatTool | undefined {
  return (
    {
      owner: { kind: "fleet" },
      "provider-profile": { kind: "profile" },
      "provider-requests": { kind: "inbox" },
      store: { kind: "storefront" },
    } as Partial<Record<ProviderView, ChatTool>>
  )[view];
}
function newDraft(profile: ProviderProfile): Draft {
  return {
    id: crypto.randomUUID(),
    name: "",
    area: profile.area,
    price: 0,
    seats: 5,
    transmission: "Not applicable",
    status: "draft",
    notes: "",
    vehicleType: "Other",
    services: [...profile.services],
    rateUnit: profile.services.includes("chauffeur")
      ? "hour"
      : profile.services.includes("self-drive")
        ? "day"
        : profile.services.includes("airport")
          ? "trip"
          : "quote",
  };
}
function loadWorking(): Draft | null {
  try {
    const v = JSON.parse(read("mono-provider-listing-chat-draft-v1") || "null");
    if (
      v &&
      ["id", "name", "area", "notes", "vehicleType", "transmission"].every(
        (k) => typeof v[k] === "string",
      ) &&
      Number.isFinite(v.price) &&
      Number.isFinite(v.seats) &&
      Array.isArray(v.services) &&
      ["day", "hour", "trip", "month", "quote"].includes(v.rateUnit)
    )
      return {
        ...v,
        services: v.services.filter(isService),
        status: v.status === "preview" ? "preview" : "draft",
      };
  } catch {
    /* Recover unsaved browser draft. */
  }
  return null;
}
function offeredServices(text: string, fallback: ServiceType[]): ServiceType[] {
  const found: ServiceType[] = [];
  for (const [pattern, id] of [
    [/self[ -]?drive|without a driver/i, "self-drive"],
    [/chauffeur|with a driver/i, "chauffeur"],
    [/airport|transfer/i, "airport"],
    [/wedding|event/i, "events"],
    [/group|shuttle/i, "group"],
    [/tour/i, "tours"],
    [/long[ -]?term|subscription/i, "long-term"],
    [/custom/i, "custom"],
  ] as [RegExp, ServiceType][])
    if (pattern.test(text)) found.push(id);
  return found.length ? found : fallback;
}
function parseDraft(text: string, draft: Draft, plain = false): Draft {
  const d = { ...draft };
  let changed = false;
  const name = text.match(
    /(?:add|list|rent out|offer)\s+(?:(?:my|a|an)\s+)?(.+?)(?=\s+(?:for|at|in|with|as)\b|$)/i,
  );
  if (
    name &&
    !/^(listing|vehicle|car|service|a listing|a vehicle)$/i.test(name[1].trim())
  ) {
    d.name = name[1].trim().slice(0, 100);
    changed = true;
  }
  const amount = text.match(/\b(?:R|ZAR)\s*(\d+(?:[ ,]\d{3})*)/i);
  if (amount) {
    d.price = Number(amount[1].replace(/[ ,]/g, ""));
    changed = true;
  }
  if (/per hour|hourly|an hour/i.test(text)) {
    d.rateUnit = "hour";
    changed = true;
  } else if (/per day|daily|a day/i.test(text)) {
    d.rateUnit = "day";
    changed = true;
  } else if (/per trip|per transfer/i.test(text)) {
    d.rateUnit = "trip";
    changed = true;
  } else if (/per month|monthly/i.test(text)) {
    d.rateUnit = "month";
    changed = true;
  } else if (/quote only|quote on request|custom quote/i.test(text)) {
    d.rateUnit = "quote";
    changed = true;
  }
  const seats = text.match(/\b(\d+)\s*(?:seats|passengers)\b/i);
  if (seats) {
    d.seats = Math.min(100, Number(seats[1]));
    changed = true;
  }
  if (/automatic/i.test(text)) {
    d.transmission = "Automatic";
    changed = true;
  } else if (/manual/i.test(text)) {
    d.transmission = "Manual";
    changed = true;
  }
  for (const [pattern, type] of [
    [/\bsuv\b/i, "SUV"],
    [/sedan/i, "Sedan"],
    [/hatchback/i, "Hatchback"],
    [/van|minibus/i, "Van / minibus"],
    [/bakkie|pickup/i, "Bakkie / pickup"],
    [/motorcycle|motorbike/i, "Motorcycle"],
    [/camper|motorhome/i, "Camper / motorhome"],
    [/truck/i, "Truck"],
  ] as [RegExp, string][])
    if (pattern.test(text)) {
      d.vehicleType = type;
      changed = true;
    }
  const area = text.match(
    /(?:based in|service area(?: is)?|located in|pickup in)\s+(.+)/i,
  );
  if (area) {
    d.area = area[1].trim().slice(0, 100);
    changed = true;
  }
  const services = offeredServices(text, d.services);
  if (services !== d.services) {
    d.services = services;
    changed = true;
  }
  if (plain && !changed && !d.name && text.length <= 100) d.name = text.trim();
  return d;
}
function listingQuestion(d: Draft) {
  return !d.name
    ? "What is the vehicle or service called?"
    : !d.services.length
      ? "Which services will this listing offer?"
      : !d.area
        ? "Where is it based?"
        : d.rateUnit !== "quote" && !d.price
          ? "What reference rate should I use? For example, “R650 per hour” or “quote only”."
          : "Your draft is ready to review. Check the vehicle category, capacity, services and rate below, then explicitly save it. Nothing is published.";
}
function parseProfile(text: string, profile: ProviderProfile): ProviderProfile {
  const p = { ...profile, services: offeredServices(text, profile.services) };
  if (/chauffeur.*(?:business|operator)|transport operator/i.test(text))
    p.kind = "chauffeur-operator";
  else if (/fleet|rental business/i.test(text)) p.kind = "fleet-business";
  else if (/private owner/i.test(text)) p.kind = "private-owner";
  else if (/multi.service|mixed/i.test(text)) p.kind = "mixed";
  const name = text.match(
    /(?:business(?: name)?(?: is)?|company(?: name)?(?: is)?|called|name is)\s+(.+?)(?=\s+(?:based|in cape|offering)\b|$)/i,
  );
  if (name) p.name = name[1].trim().slice(0, 120);
  else if (
    !p.name &&
    !/profile|business|fleet|chauffeur|operator|private owner/i.test(text) &&
    text.length <= 120
  )
    p.name = text.trim();
  const area = text.match(
    /(?:based in|service area(?: is)?|located in)\s+(.+)/i,
  );
  if (area) p.area = area[1].trim().slice(0, 120);
  return p;
}
export function ProviderConversation({
  view,
  entry,
  onEntryConsumed,
}: {
  view: ProviderView;
  entry?: string;
  onEntryConsumed?: () => void;
}) {
  const [profile, setProfile] = useState(loadProfile);
  const [profileDraft, setProfileDraft] = useState(() => {
    try {
      const v = JSON.parse(
        read("mono-provider-profile-chat-draft-v1") || "null",
      );
      if (
        v &&
        typeof v.name === "string" &&
        typeof v.area === "string" &&
        typeof v.description === "string" &&
        Array.isArray(v.services) &&
        [
          "private-owner",
          "fleet-business",
          "chauffeur-operator",
          "mixed",
        ].includes(v.kind)
      )
        return {
          ...v,
          services: v.services.filter(isService),
        } as ProviderProfile;
    } catch {
      /* Recover invalid draft. */
    }
    return loadProfile();
  });
  const [drafts, setDrafts] = useState(loadDrafts);
  const [working, setWorking] = useState(loadWorking);
  const [turns, setTurns] = useState(() => {
    const history = loadTurns("provider");
    const tool =
      initialTool(view) ||
      (!read("mono-provider-chat-v1") && history.length === 1
        ? { kind: "summary" as const }
        : undefined);
    if (tool?.kind === "summary" && history.length === 1)
      return [{ ...history[0], tool }];
    return tool && history.at(-1)?.tool?.kind !== tool.kind
      ? [
          ...history,
          turn(
            "assistant",
            "We can handle that here in your provider conversation.",
            tool,
          ),
        ]
      : history;
  });
  const active = turns.at(-1)?.tool;
  const previousView = useRef(view);
  useEffect(() => saveDemo("mono-provider-chat-v1", turns), [turns]);
  useEffect(() => saveDemo("mono-provider-profile-v1", profile), [profile]);
  useEffect(() => saveDemo("mono-listings", drafts), [drafts]);
  useEffect(
    () => saveDemo("mono-provider-profile-chat-draft-v1", profileDraft),
    [profileDraft],
  );
  useEffect(
    () => saveDemo("mono-provider-listing-chat-draft-v1", working),
    [working],
  );
  useEffect(() => {
    if (previousView.current === view) return;
    previousView.current = view;
    const tool = initialTool(view);
    if (tool)
      setTurns((all) =>
        [
          ...all,
          turn(
            "assistant",
            "Here it is, inside your provider conversation.",
            tool,
          ),
        ].slice(-60),
      );
  }, [view]);
  function respond(user: string, text: string, tool?: ChatTool) {
    setTurns((all) =>
      [
        ...all,
        ...(user ? [turn("user", user)] : []),
        turn("assistant", text, tool),
      ].slice(-60),
    );
  }
  function send(text: string) {
    if (
      /provider plans|subscription plans|compare plans|upgrade|freemium|paid plan|pricing plans/i.test(
        text,
      )
    ) {
      respond(
        text,
        "Here’s the proposed provider membership model. Compare capacity and business tools here; subscriptions and payment collection are not connected.",
        { kind: "plans" },
      );
      return;
    }
    if (/publish|confirm booking|charge|pay out/i.test(text)) {
      respond(
        text,
        "Live publishing, booking confirmation and payments are not connected. We can prepare and review your local drafts or storefront preview here.",
        { kind: "fleet" },
      );
      return;
    }
    if (/save (?:my |the )?(?:listing|profile)|^save$/i.test(text)) {
      respond(
        text,
        "Please review the details and use the Save button in this conversation to explicitly confirm the local change.",
        active,
      );
      return;
    }
    if (/incoming|inbox|requests|notifications/i.test(text)) {
      respond(
        text,
        "Your provider inbox is separate from customer demo requests. No live requests have been delivered.",
        { kind: "inbox" },
      );
      return;
    }
    if (/storefront|showroom|collection preview/i.test(text)) {
      respond(
        text,
        "Here’s your local storefront preview. It is not publicly published.",
        { kind: "storefront" },
      );
      return;
    }
    if (
      /my fleet|my listings|vehicles & services|show.*(?:fleet|listings)|open.*(?:fleet|listings)/i.test(
        text,
      )
    ) {
      respond(
        text,
        "Here are your saved provider listings. You can edit or change local preview selection without leaving chat.",
        { kind: "fleet" },
      );
      return;
    }
    if (/summary|overview|how.*business|help|what can/i.test(text)) {
      respond(
        text,
        "Here’s your provider summary. Ask me to add a listing, update your business profile, review your fleet or open your inbox.",
        { kind: "summary" },
      );
      return;
    }
    if (
      /business profile|provider profile|set up.*business|my company/i.test(
        text,
      ) ||
      (active?.kind !== "listing" && /business is|called|name is/i.test(text))
    ) {
      const next = parseProfile(text, profileDraft);
      setProfileDraft(next);
      respond(
        text,
        next.name
          ? "Review the profile below. Tell me what to change, or save it when it looks right."
          : "What is your provider or business name? You can also choose your provider type and services below.",
        { kind: "profile" },
      );
      return;
    }
    if (/\bedit\b/i.test(text)) {
      const item =
        drafts.find(
          (d) =>
            text.includes(d.id) ||
            text.toLowerCase().includes(d.name.toLowerCase()),
        ) || (drafts.length === 1 ? drafts[0] : null);
      if (item) {
        const next = parseDraft(text, item);
        setWorking(next);
        respond(text, `Let’s edit ${item.name}. ${listingQuestion(next)}`, {
          kind: "listing",
        });
      } else
        respond(text, "Which listing should we edit? Choose one below.", {
          kind: "fleet",
        });
      return;
    }
    if (
      /add.*(?:listing|vehicle|service|my|car)|list my|rent out|new listing|offer my/i.test(
        text,
      )
    ) {
      const next = parseDraft(text, newDraft(profile));
      setWorking(next);
      respond(text, listingQuestion(next), { kind: "listing" });
      return;
    }
    if (active?.kind === "listing") {
      const next = parseDraft(text, working || newDraft(profile), true);
      setWorking(next);
      respond(text, listingQuestion(next), { kind: "listing" });
      return;
    }
    if (active?.kind === "profile") {
      const next = parseProfile(text, profileDraft);
      setProfileDraft(next);
      respond(
        text,
        next.name
          ? "Your draft profile is updated. Please review and save it below."
          : "What is the name you want on your provider profile?",
        { kind: "profile" },
      );
      return;
    }
    respond(
      text,
      "We can do this in your provider chat. Tell me to add a listing, show your fleet, set up your business profile, view incoming requests or preview your storefront.",
      { kind: "summary" },
    );
  }
  function renderTool(tool: ChatTool) {
    switch (tool.kind) {
      case "listing": {
        const draft = working || newDraft(profile);
        return (
          <ListingCard
            draft={draft}
            onChange={setWorking}
            onCancel={() =>
              respond(
                "",
                "Your unfinished listing is retained on this device. Ask “add a listing” for a new one or “resume my draft” to continue.",
              )
            }
            onSave={() => {
              if (
                !draft.name.trim() ||
                !draft.area.trim() ||
                !draft.services.length ||
                (draft.rateUnit !== "quote" && draft.price <= 0)
              ) {
                respond(
                  "",
                  "Add a name, service area, at least one service and a valid reference rate (or choose quote only).",
                  { kind: "listing" },
                );
                return;
              }
              const next = {
                ...draft,
                name: draft.name.trim(),
                area: draft.area.trim(),
              };
              setDrafts((all) =>
                all.some((d) => d.id === next.id)
                  ? all.map((d) => (d.id === next.id ? next : d))
                  : [...all, next],
              );
              setWorking(next);
              respond(
                "Save my listing draft",
                `${next.name} is saved locally. No live listing was published.`,
                { kind: "fleet", feedbackId: next.id },
              );
            }}
          />
        );
      }
      case "profile":
        return (
          <ProfileCard
            profile={profileDraft}
            onChange={setProfileDraft}
            onSave={() => {
              if (
                !profileDraft.name.trim() ||
                !profileDraft.area.trim() ||
                !profileDraft.services.length
              ) {
                respond(
                  "",
                  "Please add your provider name, service area and at least one service before saving.",
                  { kind: "profile" },
                );
                return;
              }
              setProfile({
                ...profileDraft,
                name: profileDraft.name.trim(),
                area: profileDraft.area.trim(),
              });
              respond(
                "Save my provider profile",
                "Your provider profile is saved on this device. Documents, driver verification and payouts are not yet connected.",
                { kind: "summary" },
              );
            }}
          />
        );
      case "fleet":
        return (
          <FleetCards
            drafts={drafts}
            onAdd={() => send("Add a listing")}
            onEdit={(id) => {
              const item = drafts.find((d) => d.id === id);
              if (!item) return;
              setWorking(item);
              respond(
                `Edit ${item.name}`,
                `Let’s review ${item.name}. Tell me what to change, or edit the fields below.`,
                { kind: "listing" },
              );
            }}
            onPreview={(id) => {
              const item = drafts.find((d) => d.id === id);
              if (!item) return;
              setDrafts((all) =>
                all.map((d) =>
                  d.id === id
                    ? {
                        ...d,
                        status: d.status === "preview" ? "draft" : "preview",
                      }
                    : d,
                ),
              );
              respond(
                item.status === "preview"
                  ? `Remove ${item.name} from preview`
                  : `Add ${item.name} to preview`,
                "Local preview selection updated. Nothing has been publicly published.",
                { kind: "fleet" },
              );
            }}
          />
        );
      case "storefront":
        return <StorefrontCard profile={profile} drafts={drafts} />;
      case "inbox":
        return (
          <div className="conversation-inbox">
            <EmptyState title="No live requests yet.">
              Only requests addressed to your business will appear here after
              live services are connected. Customer demo drafts are never copied
              into this inbox.
            </EmptyState>
            <button className="smallbtn" onClick={() => send("My fleet")}>
              Review my listings →
            </button>
          </div>
        );
      case "plans":
        return <ProviderPlans />;
      case "summary":
        return (
          <div className="chat-business-summary">
            <h3>{profile.name || "Your provider studio"}</h3>
            <p>
              {profile.area} · {drafts.length} saved listings ·{" "}
              {drafts.filter((d) => d.status === "preview").length} in local
              preview
            </p>
            <LocalMetrics
              saved={drafts.length}
              preview={drafts.filter((d) => d.status === "preview").length}
            />
            <section
              className="provider-launch"
              aria-label="Provider launch readiness"
            >
              <h4>Your next steps</h4>
              <article>
                <span className="record-status">
                  {profile.name ? "Saved locally" : "To complete"}
                </span>
                <h5>Introduce your business</h5>
                <p>
                  A clear name, service area and offering help customers
                  understand who they’re booking with.
                </p>
                <button onClick={() => send("Business profile")}>
                  Review business details →
                </button>
              </article>
              <article>
                <span className="record-status">
                  {drafts.length
                    ? `${drafts.length} local listings`
                    : "No saved supply"}
                </span>
                <h5>Prepare your supply</h5>
                <p>
                  Add rates and service notes. Plan availability in your draft
                  notes; no live calendar is connected.
                </p>
                <button
                  onClick={() =>
                    send(drafts.length ? "My fleet" : "Add a listing")
                  }
                >
                  {drafts.length
                    ? "Review fleet & availability notes"
                    : "Create your first listing"}{" "}
                  →
                </button>
              </article>
              <article>
                <span className="record-status">Not connected</span>
                <h5>Verification & payouts</h5>
                <p>
                  Identity, ownership or operating documents, protection terms
                  and payout verification are required before live operation. No
                  verification badge is issued in this demo.
                </p>
              </article>
              <article>
                <span className="record-status">Live delivery pending</span>
                <h5>Be ready for enquiries</h5>
                <p>
                  Incoming requests will stay separate from customer drafts,
                  with a clear response action for your business.
                </p>
                <button onClick={() => send("Incoming requests")}>
                  Open provider inbox →
                </button>
              </article>
            </section>
            <div className="inline-actions">
              <button onClick={() => send("Business profile")}>
                Edit business profile
              </button>
              <button onClick={() => send("Add a listing")}>
                Create a listing draft
              </button>
              <button onClick={() => send("My fleet")}>Review my fleet</button>
            </div>
          </div>
        );
      default:
        return <p>Tell me what you want to work on next.</p>;
    }
  }
  function handleSend(text: string) {
    if (/resume.*draft/i.test(text) && working) {
      respond(text, listingQuestion(working), { kind: "listing" });
      return;
    }
    send(text);
  }
  useEffect(() => {
    if (entry) {
      handleSend(entry);
      onEntryConsumed?.();
    }
  }, [entry]);
  return (
    <ChatSurface
      role="provider"
      context={
        <ProviderContext
          name={profile.name}
          saved={drafts.length}
          preview={drafts.filter((d) => d.status === "preview").length}
          unfinished={Boolean(working)}
          onAction={handleSend}
        />
      }
      onReopen={(tool) => {
        respond(
          "Reopen this step",
          "Here is the current version of that tool, in this conversation.",
          tool,
        );
      }}
      turns={turns}
      onSend={handleSend}
      renderTool={(tool) => (
        <>
          {tool.feedbackId && (
            <CompletionFeedback
              key={tool.feedbackId}
              recordId={tool.feedbackId}
              role="provider"
            />
          )}
          {renderTool(tool)}
        </>
      )}
      onReset={() =>
        setTurns([
          turn(
            "assistant",
            "A fresh provider conversation. Your profile, listings and unfinished draft are still available. What would you like to do?",
          ),
        ])
      }
    />
  );
}
