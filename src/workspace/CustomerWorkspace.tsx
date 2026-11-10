import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  type Trip,
  type Vehicle,
  emptyTrip,
  loadJourney,
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
import { CustomerDashboard } from "./CustomerDashboard";
import { ServiceEnquiry, ServiceInquiryList } from "./ServiceEnquiry";
import { type CustomerView, type Navigate } from "./navigation";
import { loadInquiries, type ServiceType } from "../demo/services";
export function CustomerWorkspace({
  view,
  navigate,
}: {
  view: CustomerView;
  navigate: Navigate;
}) {
  const [journey, setJourney] = useState(loadJourney);
  const { trip, messages, searched } = journey;
  const [inquiries, setInquiries] = useState(loadInquiries);
  const [requests, setRequests] = useState(loadRequests);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [prompt, setPrompt] = useState("");
  const [saved, setSaved] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  const results = matches(trip);
  const days = duration(trip);
  useEffect(() => saveDemo("mono-journey-v1", journey), [journey]);
  useEffect(
    () => saveDemo("mono-service-inquiries-v1", inquiries),
    [inquiries],
  );
  useEffect(() => saveDemo("mono-requests", requests), [requests]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);
  useEffect(() => {
    setEditing(false);
  }, [view]);
  function send(text: string) {
    if (!text.trim()) return;
    if (!/self[ -]?drive/i.test(text)) {
      const service = /airport transfer/i.test(text)
        ? "airport"
        : /chauffeur|with a driver/i.test(text)
          ? "chauffeur"
          : null;
      if (service) {
        navigate(service);
        setPrompt("");
        return;
      }
    }
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
  function startService(service: ServiceType) {
    navigate(service === "self-drive" ? "chat" : service);
  }
  return (
    <>
      {view === "customer" ? (
        <CustomerDashboard
          trip={trip}
          requests={requests}
          inquiryCount={inquiries.length}
          navigate={navigate}
          onService={startService}
        />
      ) : view === "chat" ? (
        <div className="discovery-layout">
          <section className="discovery-main">
            <div className="service-mode-strip">
              <span>SELF-DRIVE RENTAL</span>
              <button
                className="text-button"
                onClick={() => navigate("customer")}
              >
                Explore all services →
              </button>
            </div>
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
              Guided demo · Your trip and conversation resume on this device.
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
                          <span className="muted">{c.area} · Cape Town</span>
                          <h3>{c.name}</h3>
                          <p className="spec-line">
                            {c.transmission} · {c.seats} seats
                          </p>
                          <p className="match-reason">
                            {trip.category || "Flexible"} choice
                            {trip.budget ? " · Fits base rental budget" : ""}
                          </p>
                          <div className="match-price">
                            <div>
                              <b>{money(days ? c.price * days : c.price)}</b>
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
                    <button
                      className="text-button"
                      onClick={() => navigate("custom")}
                    >
                      Prepare a custom enquiry →
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
      ) : view === "bookings" ? (
        <>
          <div className="eyebrow">YOUR JOURNEYS / ACTIVITY</div>
          <h2 className="page-title">Your requests & enquiries.</h2>
          <p className="muted">
            Saved on this device. Live owner responses and notifications are
            coming next.
          </p>
          {!requests.length && !inquiries.length ? (
            <div className="empty-state">
              <h2>Your next trip is waiting.</h2>
              <p>
                Find your match and review a rental estimate to save your first
                demo request.
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
                      <span className="eyebrow">
                        SELF-DRIVE / LOCAL DEMO REQUEST
                      </span>
                      <h3>{r.car}</h3>
                    </div>
                    <span className="status-badge">Saved on this device</span>
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
                    {r.status}. No owner has been contacted. Fees, deposit and
                    terms remain unquoted.
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
          <ServiceInquiryList inquiries={inquiries} />
        </>
      ) : (
        <ServiceEnquiry
          key={view}
          service={view}
          vehiclePreference={view === "custom" ? trip.category : undefined}
          navigate={navigate}
          onSave={(enquiry) => setInquiries((all) => [enquiry, ...all])}
        />
      )}
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
    </>
  );
}
