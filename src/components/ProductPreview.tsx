import { ButtonUtility } from "./base/buttons/button-utility";
import { PhoneSharePanel } from "./ui/PhoneSharePanel";
import { QrCode01 } from "@untitledui/icons";
import { useId, useState } from "react";
import { FieldInput } from "./ui/FieldInput";
import { Button } from "./base/buttons/button";
import { ArrowUpRight } from "@untitledui/icons";
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
  return (
    <section
      className="product-preview minimal-chat-entry"
      aria-labelledby="product-preview-title"
      data-reveal="fade-up"
    >
      <div className="preview-copy">
        <span className="eyebrow">START HERE</span>
        <h2 id="product-preview-title">What’s the plan?</h2>
        <p>
          A self-drive car, a chauffeur or a vehicle to list. Start with a
          message.
        </p>
      </div>
      <div className="preview-window">
        <div className="minimal-entry-header">
          <div
            className="preview-role-switch"
            aria-label="Choose an experience"
          >
            <button
              aria-pressed={role === "customer"}
              onClick={() => {
                setRole("customer");
                setMessage("");
              }}
            >
              I need a ride
            </button>
            <button
              aria-pressed={role === "provider"}
              onClick={() => {
                setRole("provider");
                setMessage("");
              }}
            >
              I provide vehicles &amp; services
            </button>
          </div>
          <ButtonUtility
            className="gomono-utility"
            icon={QrCode01}
            tooltip="Open demo on phone"
            aria-expanded={phoneOpen}
            aria-controls={phoneId}
            onPress={() => setPhoneOpen((v) => !v)}
          />
        </div>
        {phoneOpen && <PhoneSharePanel role={role} id={phoneId} />}
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
              role === "customer"
                ? "An automatic car for 3 days…"
                : "Add my vehicle for chauffeur trips…"
            }
          />
          <Button
            type="submit"
            aria-label="Continue in chat →"
            isDisabled={!message.trim()}
            iconTrailing={<ArrowUpRight width={15} height={15} />}
          >
            Continue in chat
          </Button>
        </form>
        <p className="preview-demo-note">
          Demo · Saved on this device · No live bookings or charges.
        </p>
      </div>
    </section>
  );
}
