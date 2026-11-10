import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  type Trip,
  type Vehicle,
  emptyTrip,
  loadJourney,
  loadDrafts,
  loadRequests,
  saveDemo,
  matches,
  interpret,
  reply,
  money,
  duration,
} from "../demo/marketplace";
import { TripEditor } from "./TripEditor";
import { VehicleReview } from "./VehicleReview";
import { OwnerWorkspace } from "./OwnerWorkspace";
export type View = "chat" | "bookings" | "owner" | "store";
const links: { view: View; label: string; icon: string }[] = [
  { view: "chat", label: "Concierge", icon: "✧" },
  { view: "bookings", label: "My requests", icon: "▤" },
  { view: "owner", label: "Owner workspace", icon: "▦" },
  { view: "store", label: "Storefront", icon: "◇" },
];
export function Workspace({
  view,
  navigate,
}: {
  view: View;
  navigate: (view: View | "home") => void;
}) {
  const [journey, setJourney] = useState(loadJourney);
  const { trip, messages, searched } = journey;
  const [drafts, setDrafts] = useState(loadDrafts);
  const [requests, setRequests] = useState(loadRequests);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [prompt, setPrompt] = useState("");
  const [saved, setSaved] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const results = matches(trip);
  const days = duration(trip);
  useEffect(() => saveDemo("mono-journey-v1", journey), [journey]);
  useEffect(() => saveDemo("mono-listings", drafts), [drafts]);
  useEffect(() => saveDemo("mono-requests", requests), [requests]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);
  useEffect(() => {
    heading.current?.focus();
    setEditing(false);
  }, [view]);
  function send(text: string) {
    if (!text.trim()) return;
    const next = interpret(text, trip);
    const found = matches(next);
    setJourney((j) => ({
      trip: next,
      searched: true,
      messages: [
        ...j.messages,
        { role: "user" as const, text: text.trim() },
        { role: "assistant" as const, text: reply(next, found.length) },
      ].slice(-40),
    }));
    setPrompt("");
    setSaved("");
  }
  function updateTrip(next: Trip) {
    setJourney((j) => ({
      ...j,
      trip: next,
      searched: true,
      messages: [
        ...j.messages,
        { role: "assistant" as const, text: reply(next, matches(next).length) },
      ].slice(-40),
    }));
    setEditing(false);
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    send(prompt);
  }
  return (
    <div className="workspace">
      <aside className="workspace-sidebar">
        <button className="logo home-brand" onClick={() => navigate("home")}>
          MONO.
        </button>
        <span className="sidebar-kicker">YOUR NEXT JOURNEY</span>
        <nav aria-label="Workspace">
          {links.map((l) => (
            <button
              id={`nav-${l.view}`}
              key={l.view}
              aria-current={view === l.view ? "page" : undefined}
              className={view === l.view ? "ws-nav active" : "ws-nav"}
              onClick={() => navigate(l.view)}
            >
              <span aria-hidden="true">{l.icon}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </nav>
        <div className="workspace-sidebar-foot">
          <span className="live-dot" /> Cape Town, South Africa
          <p>
            Explore the concept.
            <br />
            Every journey starts here.
          </p>
          <button aria-label="Back to website" onClick={() => navigate("home")}>
            ← Back to website
          </button>
        </div>
      </aside>
      <main className="workspace-main">
        <header className="workspace-topbar">
          <div>
            <span className="workspace-breadcrumb">
              MONO /{" "}
              {view === "chat"
                ? "DISCOVER"
                : view === "bookings"
                  ? "YOUR JOURNEYS"
                  : "OWNER STUDIO"}
            </span>
            <strong>{links.find((l) => l.view === view)?.label}</strong>
          </div>
          <span className="demo-pill">
            <i /> Demo workspace
          </span>
        </header>
        <nav className="workspace-mobile-nav" aria-label="Mobile workspace">
          {links.map((l) => (
            <button
              key={l.view}
              aria-current={view === l.view ? "page" : undefined}
              onClick={() => navigate(l.view)}
            >
              {l.view === "owner"
                ? "Owner"
                : l.view === "bookings"
                  ? "Requests"
                  : l.label}
            </button>
          ))}
          <button aria-label="Back to website" onClick={() => navigate("home")}>
            Home
          </button>
        </nav>
        <div className="workspace-content">
          <h1 ref={heading} className="sr-only" tabIndex={-1}>
            {links.find((l) => l.view === view)?.label}
          </h1>
          {view === "chat" ? (
            <div className="discovery-layout">
              <section className="discovery-main">
                <div className="eyebrow">
                  A LITTLE LESS SEARCHING. A LOT MORE GOING.
                </div>
                <h2 className="discovery-title">
                  Where can we
                  <br />
                  take you?
                </h2>
                <p className="discovery-lede">
                  Tell us the plan. We’ll help you find your kind of car.
                </p>
                {!messages.length && (
                  <div className="occasion-grid">
                    {[
                      ["Weekend escape", "I need an SUV for a weekend getaway"],
                      [
                        "Business, handled",
                        "I need an automatic sedan for business",
                      ],
                      [
                        "Keep it affordable",
                        "Show me affordable cars in Cape Town",
                      ],
                    ].map(([label, text], i) => (
                      <button key={label} onClick={() => send(text)}>
                        <span>0{i + 1}</span>
                        <b>{label}</b>
                        <span>↗</span>
                      </button>
                    ))}
                  </div>
                )}
                <div
                  id="thread"
                  className="conversation-log"
                  role="log"
                  aria-label="Conversation"
                >
                  {messages.map((m, i) => (
                    <div key={i} className={`chat-message ${m.role}`}>
                      <span className="message-label">
                        {m.role === "user" ? "YOU" : "MONO CONCIERGE"}
                      </span>
                      <p>{m.text}</p>
                    </div>
                  ))}
                  <div ref={bottom} />
                </div>
                <form className="new-composer" onSubmit={submit}>
                  <span aria-hidden="true">✧</span>
                  <input
                    aria-label="Message your concierge"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    maxLength={1000}
                    placeholder="An automatic SUV for 3 days, under R7,000 total…"
                  />
                  <button aria-label="Send message" disabled={!prompt.trim()}>
                    ↑
                  </button>
                </form>
                <p className="composer-note">
                  Guided demo · Your trip and conversation resume on this
                  device.
                </p>
                {saved && (
                  <div role="status" className="success-note">
                    <strong>Demo request saved.</strong>
                    <p>{saved}</p>
                    <button
                      className="text-button"
                      onClick={() => navigate("bookings")}
                    >
                      View my requests →
                    </button>
                  </div>
                )}
                {searched && (
                  <section
                    aria-labelledby="matches-title"
                    className="match-section"
                  >
                    <div className="section-heading">
                      <div>
                        <span className="eyebrow">CURATED FOR YOUR TRIP</span>
                        <h2 id="matches-title">
                          {results.length
                            ? `${results.length} ${results.length === 1 ? "way" : "ways"} to get there`
                            : "Let’s adjust the plan."}
                        </h2>
                      </div>
                      <span className="muted">Sample inventory</span>
                    </div>
                    {results.length ? (
                      <div className="match-grid">
                        {results.map((c) => (
                          <article className="match-card" key={c.id}>
                            <div className="match-image">
                              <img
                                src={c.img}
                                alt={`Illustrative ${c.type.toLowerCase()}`}
                                loading="lazy"
                              />
                              <span>{c.type}</span>
                              <small className="photo-note">
                                Illustrative image
                              </small>
                            </div>
                            <div className="match-content">
                              <span className="muted">
                                {c.area} · Cape Town
                              </span>
                              <h3>{c.name}</h3>
                              <p className="spec-line">
                                {c.transmission} · {c.seats} seats
                              </p>
                              <p className="match-reason">
                                {trip.category || "Flexible"} choice
                                {trip.budget
                                  ? " · Fits base rental budget"
                                  : ""}
                              </p>
                              <div className="match-price">
                                <div>
                                  <b>
                                    {money(days ? c.price * days : c.price)}
                                  </b>
                                  <small>
                                    {days
                                      ? `base rental / ${days} days`
                                      : "per day · choose dates for total"}
                                  </small>
                                </div>
                                <button
                                  className="smallbtn"
                                  onClick={() => setSelected(c)}
                                >
                                  View car
                                </button>
                              </div>
                              <p className="availability-note">
                                Availability unverified · Fees not quoted
                              </p>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <h3>No exact sample match yet.</h3>
                        <p>{reply(trip, 0)}</p>
                        <button
                          className="smallbtn"
                          onClick={() => setEditing(true)}
                        >
                          Adjust trip
                        </button>
                      </div>
                    )}
                  </section>
                )}
              </section>
              <aside className="trip-aside">
                <div className="trip-card">
                  <div className="section-heading">
                    <span className="eyebrow">YOUR TRIP</span>
                    <button
                      className="text-button"
                      onClick={() => setEditing(!editing)}
                    >
                      {editing ? "Close" : "Edit trip"}
                    </button>
                  </div>
                  <h2>{trip.location || "Choose a city"}</h2>
                  <p className="trip-date">
                    {trip.start && trip.end
                      ? `${trip.start} → ${trip.end}`
                      : days
                        ? `${days} days · Dates to be chosen`
                        : "Your next adventure"}
                  </p>
                  <p className="trip-compact">
                    {[
                      trip.make,
                      trip.category,
                      trip.transmission,
                      trip.budget
                        ? `${money(trip.budget)} ${trip.budgetMode === "total" ? "total" : "/ day"}`
                        : "Budget open",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <dl className="trip-facts">
                    <div>
                      <dt>Vehicle</dt>
                      <dd>
                        {[trip.make, trip.category, trip.tier]
                          .filter(Boolean)
                          .join(" · ") || "Open to possibilities"}
                      </dd>
                    </div>
                    <div>
                      <dt>Transmission</dt>
                      <dd>{trip.transmission || "Any"}</dd>
                    </div>
                    <div>
                      <dt>Passengers</dt>
                      <dd>{trip.passengers || "Not specified"}</dd>
                    </div>
                    <div>
                      <dt>Rental budget</dt>
                      <dd>
                        {trip.budget
                          ? `${money(trip.budget)} ${trip.budgetMode === "total" ? "total" : "/ day"}`
                          : "Not set"}
                      </dd>
                    </div>
                  </dl>
                  <button
                    className="trip-date-button"
                    onClick={() => setEditing(true)}
                  >
                    {trip.start
                      ? "Update dates & preferences"
                      : "Choose dates & preferences →"}
                  </button>
                  <p className="muted">
                    Base rental only. Final fees, deposit and terms need owner
                    confirmation.
                  </p>
                </div>
                {editing && (
                  <TripEditor
                    trip={trip}
                    onSave={updateTrip}
                    onCancel={() => setEditing(false)}
                  />
                )}
                <div className="trip-assurance">
                  <span>✧</span>
                  <h3>A clear next step.</h3>
                  <p>
                    Explore a car, review its rental estimate, then save a demo
                    request. No payment or reservation is made.
                  </p>
                </div>
                <button
                  className="text-button new-trip"
                  onClick={() => {
                    setJourney({
                      trip: { ...emptyTrip },
                      messages: [],
                      searched: false,
                    });
                    setSaved("");
                    setPrompt("");
                    setEditing(false);
                  }}
                >
                  Start a new trip
                </button>
              </aside>
            </div>
          ) : view === "owner" ? (
            <OwnerWorkspace
              drafts={drafts}
              onSave={(draft) =>
                setDrafts((all) =>
                  all.some((d) => d.id === draft.id)
                    ? all.map((d) => (d.id === draft.id ? draft : d))
                    : [...all, draft],
                )
              }
              onStore={() => navigate("store")}
            />
          ) : view === "bookings" ? (
            <>
              <div className="eyebrow">YOUR JOURNEYS / ACTIVITY</div>
              <h2 className="page-title">Your rental requests.</h2>
              <p className="muted">
                Saved on this device. Live owner responses and notifications are
                coming next.
              </p>
              {!requests.length ? (
                <div className="empty-state">
                  <h2>Your next trip is waiting.</h2>
                  <p>
                    Find your match and review a rental estimate to save your
                    first demo request.
                  </p>
                  <button className="smallbtn" onClick={() => navigate("chat")}>
                    Find a car →
                  </button>
                </div>
              ) : (
                <div className="request-list">
                  {requests.map((r) => (
                    <article className="request-card" key={r.id}>
                      <div className="section-heading">
                        <div>
                          <span className="eyebrow">LOCAL DEMO REQUEST</span>
                          <h3>{r.car}</h3>
                        </div>
                        <span className="status-badge">
                          Saved on this device
                        </span>
                      </div>
                      <p>
                        {r.start} → {r.end}
                      </p>
                      <strong>
                        {money(r.total)}{" "}
                        <span className="muted">estimated base rental</span>
                      </strong>
                      <ol className="request-timeline">
                        <li className="complete">
                          <b>Draft saved</b>
                          <span>Available in this browser</span>
                        </li>
                        <li>
                          <b>Owner response</b>
                          <span>Not sent · live service pending</span>
                        </li>
                        <li>
                          <b>Booking confirmation</b>
                          <span>Not booked · no payment collected</span>
                        </li>
                      </ol>
                      <p className="notice">
                        {r.status}. No owner has been contacted. Fees, deposit
                        and terms remain unquoted.
                      </p>
                      <button
                        className="text-button"
                        onClick={() => navigate("chat")}
                      >
                        Continue exploring →
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="eyebrow">OWNER STUDIO / LOCAL PREVIEW</div>
              <h2 className="page-title">A storefront of your own.</h2>
              <p className="muted">
                Your local showroom preview. Nothing on this page is publicly
                published.
              </p>
              <div className="storefront-hero">
                <span className="eyebrow">MONO / PARTNER COLLECTION</span>
                <h2>
                  Your next journey.
                  <br />
                  Their perfect car.
                </h2>
                <p>Cape Town · Thoughtfully selected vehicles</p>
              </div>
              {drafts.some((d) => d.status === "preview") ? (
                <div className="store-list">
                  {drafts
                    .filter((d) => d.status === "preview")
                    .map((d) => (
                      <article className="store-item" key={d.id}>
                        <span className="store-monogram">
                          {d.name.slice(0, 1)}
                        </span>
                        <div>
                          <h3>{d.name}</h3>
                          <p>
                            {d.area} · {d.transmission} · {d.seats} seats
                          </p>
                          {d.notes && <p className="muted">{d.notes}</p>}
                        </div>
                        <strong>{money(d.price)} / day</strong>
                      </article>
                    ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h2>Your collection starts with a draft.</h2>
                  <p>
                    Save a vehicle in your workspace and select “Add to preview”
                    to see it here.
                  </p>
                  <button
                    className="smallbtn"
                    onClick={() => navigate("owner")}
                  >
                    Manage vehicles →
                  </button>
                </div>
              )}
              <p className="notice">
                Preview vehicles are separate from renter sample inventory.
                Availability, verification and public publishing are not
                enabled.
              </p>
            </>
          )}
        </div>
        <footer className="workspace-footer">
          MONO · Cape Town{" "}
          <span>Demonstration only · No live reservations</span>
        </footer>
      </main>
      {selected && (
        <VehicleReview
          car={selected}
          trip={trip}
          onClose={() => setSelected(null)}
          onSave={(r, next) => {
            setRequests((all) => [r, ...all]);
            setJourney((j) => ({ ...j, trip: next }));
            setSelected(null);
            setSaved(
              `${r.car} · ${r.start} to ${r.end} · ${money(r.total)} base rental. No owner has been contacted.`,
            );
          }}
        />
      )}
    </div>
  );
}

import "./workspace.css";
