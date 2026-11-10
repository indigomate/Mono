import { CalendarPicker } from "../components/ui/CalendarPicker";
import { BriefProgress } from "../components/ui/ConversationElements";
import { DecisionHelp } from "../conversation/JourneyContext";
import { Mail01 } from "@untitledui/icons";
import { FieldSelect } from "../components/ui/FieldSelect";
import { FieldTextarea } from "../components/ui/FieldTextarea";
import { FieldInput } from "../components/ui/FieldInput";
import { useEffect, useState, type FormEvent } from "react";
import {
  services,
  vehicleTypes,
  type ServiceInquiry,
  type ServiceType,
  serviceLabel,
} from "../demo/services";
import { saveDemo, today, money } from "../demo/marketplace";
import { read } from "../demo/storage";
import { type Navigate } from "./navigation";
export type EnquiryFields = Omit<
  ServiceInquiry,
  "id" | "createdAt" | "service"
>;
const emptyFields: EnquiryFields = {
  vehicleType: "Any suitable vehicle",
  driver: "flexible",
  date: "",
  time: "",
  end: "",
  pickup: "",
  destination: "",
  passengers: 1,
  hours: 1,
  budget: 0,
  notes: "",
  email: "",
};
export function loadFields(service: string): EnquiryFields {
  const initialDriver: EnquiryFields["driver"] = [
    "chauffeur",
    "airport",
    "events",
    "group",
    "tours",
  ].includes(service)
    ? "with-driver"
    : service === "long-term"
      ? "self-drive"
      : "flexible";
  try {
    const v = JSON.parse(read(`mono-enquiry-draft-${service}`) || "null");
    if (v && typeof v === "object") {
      const result = { ...emptyFields, driver: initialDriver };
      for (const k of Object.keys(result) as (keyof EnquiryFields)[])
        if (typeof result[k] === typeof v[k])
          Object.assign(result, { [k]: v[k] });
      for (const k of ["passengers", "hours", "budget"] as const)
        if (!Number.isFinite(result[k]) || result[k] < 0)
          result[k] = emptyFields[k];
      if (["chauffeur", "airport"].includes(service))
        result.driver = "with-driver";
      else if (
        !["with-driver", "self-drive", "flexible"].includes(result.driver)
      )
        result.driver = initialDriver;
      return result;
    }
  } catch {
    /* Ignore corrupt local drafts. */
  }
  return {
    ...emptyFields,
    driver: services.find((s) => s.id === service)?.driver
      ? "with-driver"
      : service === "long-term"
        ? "self-drive"
        : "flexible",
  };
}
export function ServiceEnquiry({
  service,
  navigate,
  onSave,
  vehiclePreference,
  controlledFields,
  onFieldsChange,
}: {
  service: Exclude<ServiceType, "self-drive">;
  navigate: Navigate;
  onSave: (enquiry: ServiceInquiry) => void;
  vehiclePreference?: string;
  controlledFields?: EnquiryFields;
  onFieldsChange?: (fields: EnquiryFields) => void;
}) {
  const definition = services.find((s) => s.id === service)!;
  const [internalFields, setFields] = useState(() => {
    const initial = loadFields(service);
    return vehiclePreference && initial.vehicleType === "Any suitable vehicle"
      ? { ...initial, vehicleType: vehiclePreference }
      : initial;
  });
  const fields = controlledFields ?? internalFields;
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const longTerm = service === "long-term";
  const pointToPoint = ["airport", "group"].includes(service);
  useEffect(
    () => saveDemo(`mono-enquiry-draft-${service}`, fields),
    [fields, service],
  );
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fields.date < today()) {
      setError("Choose a date today or later.");
      return;
    }
    if (longTerm && (!fields.end || fields.end <= fields.date)) {
      setError("Choose an end date after your start date.");
      return;
    }
    if (!fields.pickup.trim() || (pointToPoint && !fields.destination.trim())) {
      setError("Add pickup and required destination details.");
      return;
    }
    onSave({
      ...fields,
      pickup: fields.pickup.trim(),
      destination: fields.destination.trim(),
      notes: fields.notes.trim(),
      service,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
    setSaved(true);
    setError("");
  }
  const update = <K extends keyof EnquiryFields>(
    key: K,
    value: EnquiryFields[K],
  ) => {
    if (onFieldsChange) onFieldsChange({ ...fields, [key]: value });
    else setFields((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };
  return (
    <>
      <button className="text-button" onClick={() => navigate("customer")}>
        ← All services
      </button>
      <div className="eyebrow">RENT & RIDE / SERVICE ENQUIRY</div>
      <h2 className="page-title">{definition.label}.</h2>
      <p className="discovery-lede">
        {definition.description} Build a clear brief for a provider to quote.
      </p>
      <div className="service-enquiry-layout">
        <form className="service-enquiry-form" onSubmit={submit}>
          <div className="section-heading">
            <h3>Your service brief</h3>
            <span className="status-badge">Quote required</span>
          </div>
          <BriefProgress
            checks={[
              { label: "Pickup", complete: Boolean(fields.pickup.trim()) },
              { label: "Service date", complete: Boolean(fields.date) },
              {
                label: "Contact email",
                complete: Boolean(fields.email.trim()),
              },
            ]}
          />
          <div className="mono-calendar-options">
            <CalendarPicker
              label={longTerm ? "Start date" : "Service date"}
              initiallyOpen
              value={fields.date}
              min={today()}
              onChange={(value) => update("date", value)}
            />
            {longTerm && (
              <CalendarPicker
                label="End date"
                value={fields.end}
                min={fields.date || today()}
                onChange={(value) => update("end", value)}
              />
            )}
          </div>
          <div className="fields-grid">
            <FieldSelect
              aria-label="Vehicle preference"
              value={fields.vehicleType}
              onChange={(e) => update("vehicleType", e.target.value)}
              label="Vehicle preference"
              options={[
                {
                  label: "Any suitable vehicle",
                  value: "Any suitable vehicle",
                },
                ...vehicleTypes.map((t) => ({ label: t, value: t })),
              ]}
            />
            <FieldSelect
              aria-label="Driver arrangement"
              value={fields.driver}
              onChange={(e) =>
                update("driver", e.target.value as EnquiryFields["driver"])
              }
              label="Driver arrangement"
              options={[
                ...(["chauffeur", "airport"].includes(service)
                  ? [{ label: "With a driver", value: "with-driver" }]
                  : [
                      { label: "With a driver", value: "with-driver" },
                      { label: "Without a driver", value: "self-drive" },
                      { label: "Open to either", value: "flexible" },
                    ]),
              ]}
            />
            <FieldInput
              type="number"
              min="1"
              max="100"
              required
              value={fields.passengers}
              onChange={(e) => update("passengers", Number(e.target.value))}
              label="Passengers"
            />
            <FieldInput
              type="date"
              min={today()}
              required
              value={fields.date}
              onChange={(e) => update("date", e.target.value)}
              label={longTerm ? "Start date" : "Service date"}
            />
            {longTerm ? (
              <FieldInput
                type="date"
                min={fields.date || today()}
                required
                value={fields.end}
                onChange={(e) => update("end", e.target.value)}
                label="End date"
              />
            ) : (
              <FieldInput
                type="time"
                required
                value={fields.time}
                onChange={(e) => update("time", e.target.value)}
                label="Pickup time (Cape Town)"
              />
            )}
            <FieldInput
              maxLength={200}
              required
              value={fields.pickup}
              onChange={(e) => update("pickup", e.target.value)}
              placeholder={
                service === "airport"
                  ? "Cape Town International Airport"
                  : "Address or pickup area"
              }
              label="Pickup location"
            />
            <FieldInput
              maxLength={200}
              required={pointToPoint}
              value={fields.destination}
              onChange={(e) => update("destination", e.target.value)}
              placeholder={
                service === "airport"
                  ? "Hotel, address or destination"
                  : "Where would you like to go?"
              }
              label={
                pointToPoint
                  ? "Destination"
                  : "Destination or itinerary (optional)"
              }
            />
            {service === "chauffeur" && (
              <FieldInput
                type="number"
                min="1"
                max="168"
                required
                value={fields.hours}
                onChange={(e) => update("hours", Number(e.target.value))}
                label="Driver hours required"
              />
            )}
            <FieldInput
              type="number"
              min="0"
              max="10000000"
              value={fields.budget}
              onChange={(e) => update("budget", Number(e.target.value))}
              label="Target total budget (ZAR, optional)"
              hint="An optional target, not a confirmed provider quote."
              prefix="R"
            />
          </div>
          <FieldTextarea
            maxLength={2000}
            value={fields.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder={
              service === "custom"
                ? "Describe the rental or transport you need, including whether a driver is required."
                : "Vehicle size, luggage, accessibility, stops, driver requirements…"
            }
            label={
              service === "airport"
                ? "Flight number, luggage & special requests (optional)"
                : service === "events"
                  ? "Occasion, number of vehicles & arrangements (optional)"
                  : "Requirements & special arrangements (optional)"
            }
          />
          <FieldInput
            type="email"
            icon={Mail01}
            autoComplete="email"
            required
            maxLength={254}
            value={fields.email}
            onChange={(e) => update("email", e.target.value)}
            label="Your email"
          />
          <label className="check-field">
            <input type="checkbox" required />I understand this saves a demo
            enquiry on this device. It is not sent to a provider.
          </label>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {saved ? (
            <div className="success-note" role="status">
              <b>Service enquiry saved.</b>
              <p>
                Your brief stays in your customer workspace. No provider has
                been contacted.
              </p>
              <button
                type="button"
                className="text-button"
                onClick={() => navigate("bookings")}
              >
                View my requests →
              </button>
            </div>
          ) : (
            <button className="smallbtn">Save demo enquiry →</button>
          )}
        </form>
        <aside className="service-brief-aside">
          <span className="eyebrow">YOUR REQUEST TYPE</span>
          <h3>{definition.label}</h3>
          <p>
            {definition.driver
              ? "Driver-led transport. Provider confirmation of the driver, vehicle and arrangements will be needed."
              : longTerm
                ? "A longer rental or subscription. Contract length, mileage and terms need a provider quote."
                : "A flexible brief for needs that do not fit a standard rental. A provider must confirm what they can offer."}
          </p>
          <dl>
            <div>
              <dt>Budget</dt>
              <dd>
                {fields.budget
                  ? `${money(fields.budget)} target total`
                  : "To be discussed"}
              </dd>
            </div>
            <div>
              <dt>Pricing basis</dt>
              <dd>
                {definition.unit === "hour"
                  ? "Hours + itinerary"
                  : definition.unit === "trip"
                    ? "Route + passengers"
                    : longTerm
                      ? "Duration + agreement"
                      : "Custom provider quote"}
              </dd>
            </div>
            <div>
              <dt>Booking status</dt>
              <dd>Not submitted</dd>
            </div>
          </dl>
          <DecisionHelp />
          <p className="notice">
            No daily-car-rental estimate is applied to this service.
            Availability, inclusions, deposits and cancellation terms must be
            confirmed before any future booking.
          </p>
          <span className="draft-hint">Your brief resumes on this device.</span>
        </aside>
      </div>
    </>
  );
}
export function ServiceInquiryList({
  inquiries,
  onReview,
}: {
  inquiries: ServiceInquiry[];
  onReview?: (inquiry: ServiceInquiry) => void;
}) {
  if (!inquiries.length) return null;
  return (
    <section className="service-inquiry-list">
      <h3>Service enquiries</h3>
      {inquiries.map((i) => (
        <article className="request-card journey-record" key={i.id}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">{serviceLabel(i.service)}</span>
              <h3>{i.vehicleType}</h3>
            </div>
            <span className="status-badge">Saved locally · not sent</span>
          </div>
          <p>
            {i.date}
            {i.time ? ` · ${i.time} Cape Town time` : ""}
            {i.end ? ` → ${i.end}` : ""}
          </p>
          <p>
            {i.pickup}
            {i.destination ? ` → ${i.destination}` : ""} · {i.passengers}{" "}
            passengers
          </p>
          {i.budget > 0 && (
            <p>Target budget: {money(i.budget)} total · not a quote</p>
          )}
          <details className="inquiry-details">
            <summary>View service brief</summary>
            <p>
              <b>Driver arrangement:</b>{" "}
              {i.driver === "with-driver"
                ? "With a driver"
                : i.driver === "self-drive"
                  ? "Without a driver"
                  : "Open to either"}
            </p>
            {i.service === "chauffeur" && (
              <p>
                <b>Driver hours:</b> {i.hours}
              </p>
            )}
            <p>
              <b>Special requirements:</b> {i.notes || "None added"}
            </p>
          </details>
          <dl>
            <div>
              <dt>Payment</dt>
              <dd>No payment collected</dd>
            </div>
            <div>
              <dt>Confirmation</dt>
              <dd>No booking confirmed</dd>
            </div>
          </dl>
          {onReview && (
            <button className="smallbtn" onClick={() => onReview(i)}>
              Revise this service brief in chat →
            </button>
          )}
          <p className="notice">
            Provider quote required. No driver, vehicle or availability is
            confirmed.
          </p>
        </article>
      ))}
    </section>
  );
}
