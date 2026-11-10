import { PaymentChoices } from "../conversation/PaymentChoices";
import { DecisionHelp } from "../conversation/JourneyContext";
import { Mail01 } from "@untitledui/icons";
import { FieldInput } from "../components/ui/FieldInput";
import { useEffect, useRef, useState } from "react";
import {
  type Vehicle,
  type Trip,
  type Request,
  money,
  duration,
  today,
} from "../demo/marketplace";
export function VehicleReview({
  car,
  trip,
  onClose,
  onSave,
  inline = false,
  initialStep = "details",
  onStepChange,
  onTripChange,
}: {
  car: Vehicle;
  trip: Trip;
  onClose: () => void;
  onSave: (request: Request, trip: Trip) => void;
  inline?: boolean;
  initialStep?: "details" | "quote";
  onStepChange?: (step: "details" | "quote") => void;
  onTripChange?: (trip: Trip) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<"details" | "quote">(initialStep);
  const [start, setStart] = useState(trip.start);
  const [end, setEnd] = useState(trip.end);
  const [error, setError] = useState("");
  const datedTrip = { ...trip, start, end };
  const days = start && end ? duration(datedTrip) : 0;
  const total = days * car.price;
  const overBudget =
    trip.budget > 0 &&
    (trip.budgetMode === "total"
      ? total > trip.budget
      : car.price > trip.budget);
  useEffect(() => {
    if (inline) return;
    const node = dialog.current!;
    const previous = document.activeElement as HTMLElement | null;
    node.showModal();
    return () => {
      node.close();
      queueMicrotask(() => {
        if (previous?.isConnected) previous.focus();
      });
    };
  }, [inline]);
  const content = (
    <>
      <div className="section-heading">
        <span className="eyebrow">
          {step === "details" ? "01 / YOUR MATCH" : "02 / REVIEW YOUR REQUEST"}
        </span>
        <button
          aria-label="Close vehicle review"
          className="icon-button"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <h2 id="review-title">{car.name}</h2>
      {step === "details" ? (
        <>
          <img
            className="detail-photo"
            src={car.img}
            alt={`Illustrative ${car.type.toLowerCase()} photograph`}
          />
          <p className="image-caption">
            Illustrative photograph · Demo specifications · Availability
            unverified
          </p>
          <div className="detail-specs">
            <span>{car.seats} seats</span>
            <span>{car.transmission}</span>
            <span>{car.area}</span>
          </div>
          <p>
            A sample match for your{" "}
            {trip.category ? trip.category.toLowerCase() : "Cape Town"} trip
            {trip.budget
              ? ` within your ${trip.budgetMode === "total" ? "base rental" : "daily"} budget`
              : ""}
            .
          </p>
          <div className="policy-grid">
            <div>
              <strong>Pickup & return</strong>
              <p>
                {car.area}, Cape Town. Exact instructions require owner
                confirmation.
              </p>
            </div>
            <div>
              <strong>Before you commit</strong>
              <p>
                Mileage allowance, insurance excess, deposit and cancellation
                terms must be provided by the owner.
              </p>
            </div>
          </div>
          <DecisionHelp />
          <div className="review-footer">
            <span>
              <b>{money(car.price)}</b> / day
            </span>
            <button
              className="smallbtn"
              onClick={() => {
                setStep("quote");
                onStepChange?.("quote");
              }}
            >
              Review rental estimate →
            </button>
          </div>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!start || !end || start < today() || days < 1) {
              setError(
                "Choose a pickup date today or later and a return date after pickup.",
              );
              return;
            }
            if (overBudget) {
              setError(
                "This base rental exceeds your saved budget. Go back and edit your trip before saving.",
              );
              return;
            }
            const f = new FormData(e.currentTarget);
            onSave(
              {
                id: crypto.randomUUID(),
                car: car.name,
                start,
                end,
                email: String(f.get("email")),
                total,
                status: "Demo request — not submitted",
                createdAt: new Date().toISOString(),
              },
              datedTrip,
            );
          }}
        >
          <p className="muted">
            Review the base rental before saving. No payment is collected and no
            owner will be contacted.
          </p>
          <div className="fields-grid">
            <FieldInput
              type="date"
              required
              min={today()}
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
                onTripChange?.({ ...trip, start: e.target.value, end });
              }}
              label="Pickup date"
            />
            <FieldInput
              type="date"
              required
              min={start || today()}
              value={end}
              onChange={(e) => {
                setEnd(e.target.value);
                onTripChange?.({ ...trip, start, end: e.target.value });
              }}
              label="Return date"
            />
          </div>
          <dl className="quote-lines">
            <div>
              <dt>Daily rental</dt>
              <dd>{money(car.price)}</dd>
            </div>
            <div>
              <dt>Rental duration</dt>
              <dd>{days || "—"} days</dd>
            </div>
            <div className="quote-total">
              <dt>Estimated base rental</dt>
              <dd>{days > 0 ? money(total) : "Choose dates"}</dd>
            </div>
            <div>
              <dt>Fees, deposit & insurance</dt>
              <dd>Not yet quoted</dd>
            </div>
          </dl>
          <p className="notice">
            This is not an all-inclusive quote. A live booking will require
            verified availability, full terms and your explicit approval.
          </p>
          <PaymentChoices />
          {overBudget && days > 0 && (
            <p role="alert" className="form-error">
              Over your saved{" "}
              {trip.budgetMode === "total" ? "whole-rental" : "daily"} budget of{" "}
              {money(trip.budget)}. Edit your trip to continue.
            </p>
          )}
          <FieldInput
            name="email"
            type="email"
            icon={Mail01}
            required
            placeholder="you@example.com"
            autoComplete="email"
            label="Your email"
          />
          <label className="check-field">
            <input type="checkbox" required />I understand this saves a demo
            request on this device only.
          </label>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <div className="review-footer">
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setStep("details");
                onStepChange?.("details");
              }}
            >
              ← Vehicle details
            </button>
            <button className="smallbtn" disabled={days < 1 || overBudget}>
              Save demo request
            </button>
          </div>
        </form>
      )}
    </>
  );
  return inline ? (
    <section
      className="vehicle-dialog inline-review"
      aria-label="Vehicle details and estimate"
    >
      {content}
    </section>
  ) : (
    <dialog
      ref={dialog}
      className="vehicle-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      aria-labelledby="review-title"
    >
      {content}
    </dialog>
  );
}
