import type { ReactNode } from "react";
import type { Trip } from "../demo/marketplace";
import { money } from "../demo/marketplace";
import { serviceLabel, type ServiceType } from "../demo/services";
import type { EnquiryFields } from "../workspace/ServiceEnquiry";

export function JourneyContext({
  service,
  trip,
  fields,
  stage,
  onEdit,
}: {
  service: ServiceType | null;
  trip: Trip;
  fields?: EnquiryFields;
  stage: "brief" | "options" | "review";
  onEdit: () => void;
}) {
  const labels = ["Your brief", "Options", "Review", "Payment", "Confirmed"];
  const index = stage === "review" ? 2 : stage === "options" ? 1 : 0;
  const date = fields ? fields.date : trip.start;
  const end = fields ? fields.end : trip.end;
  const location = fields
    ? [fields.pickup, fields.destination].filter(Boolean).join(" → ")
    : trip.location;
  const budget = fields ? fields.budget : trip.budget;
  const passengers = fields ? fields.passengers : trip.passengers;
  return (
    <div className="journey-context">
      <ol className="journey-stages" aria-label="Rental journey">
        {labels.map((label, i) => (
          <li
            key={label}
            aria-current={i === index ? "step" : undefined}
            data-future={i > index}
          >
            <span aria-hidden="true">{i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <details
        className="brief-pocket"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button"))
            e.currentTarget.open = false;
        }}
      >
        <summary>
          <span>
            <b>{service ? serviceLabel(service) : "Your next journey"}</b>
            <small>
              {location || "Choose a pickup"}
              {date ? ` · ${date}` : " · Dates to decide"}
            </small>
          </span>
          <span className="brief-expand">Brief +</span>
        </summary>
        <div className="brief-pocket-body">
          <dl>
            <div>
              <dt>Route / pickup</dt>
              <dd>
                <button onClick={onEdit}>{location || "Add pickup"}</button>
              </dd>
            </div>
            <div>
              <dt>Dates & time</dt>
              <dd>
                <button onClick={onEdit}>
                  {date
                    ? `${date}${end ? ` → ${end}` : ""}${fields?.time ? ` · ${fields.time} SAST` : ""}`
                    : "Add dates"}
                </button>
              </dd>
            </div>
            <div>
              <dt>Passengers</dt>
              <dd>
                <button onClick={onEdit}>
                  {passengers || "Add passengers"}
                </button>
              </dd>
            </div>
            <div>
              <dt>Budget</dt>
              <dd>
                <button onClick={onEdit}>
                  {budget
                    ? `${money(budget)}${!fields && trip.budgetMode === "daily" ? " / day" : " total target"}`
                    : "Set budget"}
                </button>
              </dd>
            </div>
          </dl>
          <p>
            Planning only. Live sourcing, payment and confirmation have not
            started.
          </p>
          <button className="text-button" onClick={onEdit}>
            Edit this brief in chat →
          </button>
        </div>
      </details>
    </div>
  );
}
export function ProviderContext({
  name,
  saved,
  preview,
  unfinished,
  onAction,
}: {
  name: string;
  saved: number;
  preview: number;
  unfinished: boolean;
  onAction: (text: string) => void;
}) {
  return (
    <details
      className="brief-pocket provider-pocket"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button"))
          e.currentTarget.open = false;
      }}
    >
      <summary>
        <span>
          <b>{name || "Build your provider presence"}</b>
          <small>
            {saved} saved listings · {preview} in preview
            {unfinished ? " · Draft to finish" : ""}
          </small>
        </span>
        <span className="brief-expand">Actions +</span>
      </summary>
      <div className="brief-pocket-body">
        <p>
          Finish your details, review your supply, and prepare for requests.
        </p>
        <div className="provider-context-actions">
          <button
            onClick={() =>
              onAction(unfinished ? "Resume my draft" : "Add a listing")
            }
          >
            {unfinished ? "Resume listing draft" : "List a vehicle or service"}
          </button>
          <button onClick={() => onAction("Business profile")}>
            Complete business details
          </button>
          <button onClick={() => onAction("Incoming requests")}>
            Review incoming requests
          </button>
        </div>
        <small>
          Verification, live availability and request delivery are not
          connected.
        </small>
      </div>
    </details>
  );
}
export function DecisionHelp({ children }: { children?: ReactNode }) {
  return (
    <details className="decision-help">
      <summary>Before you commit · payments, protection & cancellation</summary>
      <div>
        <p>
          <b>Availability:</b> sample vehicles need provider confirmation before
          they can be booked.
        </p>
        <p>
          <b>Payment:</b> nothing is charged in this demo. A live checkout must
          show the full quote and request your approval.
        </p>
        <p>
          <b>Security deposit:</b> separate from rental charges. The amount,
          collection method, release timing and deductions must be disclosed
          before payment.
        </p>
        <p>
          <b>Cancellation & protection:</b> review the provider’s cancellation
          schedule, coverage, exclusions, mileage and damage liability before
          accepting.
        </p>
        {children}
      </div>
    </details>
  );
}
