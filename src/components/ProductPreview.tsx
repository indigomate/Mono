import { ButtonUtility } from "./base/buttons/button-utility";
import { PhoneSharePanel } from "./ui/PhoneSharePanel";
import { ArrowUpRight, QrCode01 } from "@untitledui/icons";
import { useState, useId } from "react";
import { FieldInput } from "./ui/FieldInput";
import {
  BriefProgress,
  InlineCTA,
  LocalMetrics,
} from "./ui/ConversationElements";
import { LoadingIndicator } from "./ui/LoadingIndicator";
import { inventory, loadDrafts, money } from "../demo/marketplace";
import "./product-preview.css";

export function ProductPreview({
  onStart,
}: {
  onStart: (role: "customer" | "provider", text: string) => void;
}) {
  const [role, setRole] = useState<"customer" | "provider">("customer");
  const [message, setMessage] = useState("");
  const [phoneOpen, setPhoneOpen] = useState(false);
  const phoneId = useId();
  const [showLoading, setShowLoading] = useState(false);
  const drafts = loadDrafts();
  const car = inventory.find((c) => c.id === 3)!;
  const customer = role === "customer";
  return (
    <section
      className="product-preview"
      aria-labelledby="product-preview-title"
    >
      <div className="preview-copy">
        <span className="eyebrow">STEP INSIDE GOMONO</span>
        <h2 id="product-preview-title">
          The conversation.
          <br />
          The details.
          <br />
          <em>All in one place.</em>
        </h2>
        <p>
          You shouldn’t have to imagine how it works. Explore the interface
          below, then continue directly into your own conversation.
        </p>
        <div className="preview-role-switch" aria-label="Choose an experience">
          <button
            aria-pressed={customer}
            onClick={() => {
              setRole("customer");
              setMessage("");
            }}
          >
            I need a ride
          </button>
          <button
            aria-pressed={!customer}
            onClick={() => {
              setRole("provider");
              setMessage("");
            }}
          >
            I provide vehicles & services
          </button>
        </div>
        <p className="preview-demo-note">
          Interactive demo · no live bookings or charges. Your drafts stay on
          this device.
        </p>
      </div>
      <div className="preview-window">
        <header>
          <span className="preview-orb" aria-hidden="true">
            ✧
          </span>
          <div>
            <b>GOMONO</b>
            <small>
              {customer
                ? "Your rental conversation"
                : "Your provider conversation"}
            </small>
          </div>
          <span className="preview-local">LOCAL DEMO</span>
          <ButtonUtility
            className="gomono-utility"
            icon={QrCode01}
            tooltip="Open demo on phone"
            aria-expanded={phoneOpen}
            aria-controls={phoneId}
            onPress={() => setPhoneOpen((open) => !open)}
          />
        </header>
        {phoneOpen && <PhoneSharePanel role={role} id={phoneId} />}
        <div className="preview-message">
          <span>GOMONO</span>
          <p>
            {customer
              ? "Tell me your plans. Compare vehicles, choose dates and review the details right here."
              : "Let’s build your business presence. Start a listing, review your details, or explore your provider inbox."}
          </p>
        </div>
        {customer ? (
          <article className="preview-sample">
            <div className="preview-photo">
              <img
                src={car.img}
                alt="Illustrative sample vehicle"
                loading="lazy"
              />
              <span>Illustrative image</span>
            </div>
            <div>
              <span className="preview-tag">SAMPLE VEHICLE · NOT VERIFIED</span>
              <h3>{car.name}</h3>
              <p>
                {car.transmission} · {car.seats} seats · {car.area}
              </p>
              <b>
                {money(car.price)} <small>/ day base rental</small>
              </b>
              <button
                onClick={() => onStart("customer", `Show me ${car.name}`)}
              >
                Review this sample in chat →
              </button>
            </div>
          </article>
        ) : (
          <div className="preview-metrics">
            <LocalMetrics
              saved={drafts.length}
              preview={drafts.filter((d) => d.status === "preview").length}
            />
            <p>Counts reflect your saved records on this device.</p>
          </div>
        )}
        <InlineCTA
          title={
            customer
              ? "Let’s make it your trip."
              : "Your first listing starts here."
          }
          action={customer ? "Plan dates & budget" : "Create a listing"}
          onAction={() =>
            onStart(role, customer ? "Edit my trip" : "Add a listing")
          }
        >
          {customer
            ? "Open the date calendars, set your budget and build an editable brief."
            : "Add vehicle details and services, then review your draft before saving."}
        </InlineCTA>
        <div className="preview-tools" aria-label="Explore the interface">
          {(customer
            ? [
                ["Compare sample cars", "Find a self-drive vehicle"],
                ["Chauffeur & transfers", "Explore services"],
                ["My saved requests", "My requests"],
              ]
            : [
                ["Business & readiness", "summary"],
                ["Fleet & storefront", "My fleet"],
                ["Incoming requests", "Incoming requests"],
              ]
          ).map(([label, command]) => (
            <button key={label} onClick={() => onStart(role, command)}>
              {label} <ArrowUpRight width={12} height={12} aria-hidden="true" />
            </button>
          ))}
        </div>
        <form
          className="preview-composer"
          onSubmit={(e) => {
            e.preventDefault();
            if (message.trim()) onStart(role, message.trim());
          }}
        >
          <FieldInput
            label="Start your conversation"
            value={message}
            onValueChange={setMessage}
            maxLength={1000}
            placeholder={
              customer
                ? "An automatic car for 3 days…"
                : "Add my vehicle for chauffeur trips…"
            }
          />
          <button type="submit" disabled={!message.trim()}>
            Continue in chat →
          </button>
        </form>
        <details className="preview-component-note" open>
          <summary>See progress & loading styles</summary>
          <BriefProgress
            checks={[
              { label: "Choose your workspace", complete: true },
              {
                label: "Describe your plan",
                complete: Boolean(message.trim()),
              },
            ]}
          />
          <button
            aria-expanded={showLoading}
            onClick={() => setShowLoading((v) => !v)}
          >
            {showLoading
              ? "Hide animation preview"
              : "Preview loading animation"}
          </button>
          {showLoading && (
            <>
              <LoadingIndicator label="Loading animation preview" />
              <p>
                Visual preview only. No search, booking or payment is running.
              </p>
            </>
          )}
        </details>
      </div>
    </section>
  );
}
