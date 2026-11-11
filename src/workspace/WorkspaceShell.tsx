import { FieldInput } from "../components/ui/FieldInput";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { type View, type Navigate } from "./navigation";
export function WorkspaceShell({
  role,
  view,
  navigate,
  children,
}: {
  role: "customer" | "provider";
  view: View;
  navigate: Navigate;
  children: ReactNode;
}) {
  const title = useRef<HTMLHeadingElement>(null);
  const provider = role === "provider";
  const label = provider ? "Provider assistant" : "Customer concierge";
  useEffect(() => {
    title.current?.focus();
  }, [view]);
  return (
    <div className={`workspace chat-layout role-${role}`}>
      <main className="workspace-main">
        <header className="workspace-topbar">
          <div className="minimal-workspace-identity">
            <button
              className="logo home-brand"
              aria-label="Back to website"
              onClick={() => navigate("home")}
            >
              GOMONO.
            </button>
            <strong>{label}</strong>
          </div>
          <div className="workspace-top-actions">
            <button
              className="text-button workspace-switch"
              onClick={() => navigate("workspaces")}
            >
              Change workspace
            </button>
          </div>
        </header>
        <div className="workspace-content">
          <h1 className="sr-only" ref={title} tabIndex={-1}>
            {label}
          </h1>
          {children}
        </div>
      </main>
    </div>
  );
}
export function WorkspaceChooser({ navigate }: { navigate: Navigate }) {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState(
    "Are you looking for a rental or transport service, or do you provide vehicles and services?",
  );
  return (
    <main className="workspace-chooser conversation-chooser">
      <button className="logo" onClick={() => navigate("home")}>
        GOMONO.
      </button>
      <div className="chooser-chat">
        <span className="eyebrow">ONE MARKETPLACE. TWO CONVERSATIONS.</span>
        <h1>
          Let’s start
          <br />
          with you.
        </h1>
        <div className="chooser-message" role="log">
          <span className="turn-role">GOMONO</span>
          <p>{reply}</p>
          <div className="inline-actions">
            <button
              aria-label="I want to rent or ride"
              onClick={() => navigate("customer")}
            >
              <b>I want to rent or ride</b>
              <small>
                Plan rentals and transport in your customer conversation.
              </small>
              <span aria-hidden="true">Start planning →</span>
            </button>
            <button
              aria-label="I provide vehicles or services"
              onClick={() => navigate("provider")}
            >
              <b>I provide vehicles or services</b>
              <small>
                Prepare your business, vehicles and service listings.
              </small>
              <span aria-hidden="true">Open provider chat →</span>
            </button>
          </div>
        </div>
        <form
          className="chat-composer"
          onSubmit={(e) => {
            e.preventDefault();
            if (/provider|owner|list|fleet|offer|rent out|my car/i.test(input))
              navigate("provider");
            else if (/rent|ride|book|customer|chauffeur|transfer/i.test(input))
              navigate("customer");
            else
              setReply(
                "Choose the customer conversation to rent or ride, or the provider conversation to manage vehicles and services. Which one fits you?",
              );
          }}
        >
          <FieldInput
            aria-label="Choose your conversation"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={300}
            placeholder="Tell me what brings you to GOMONO…"
          />
          <button
            aria-label="Continue to conversation"
            disabled={!input.trim()}
          >
            ↑
          </button>
        </form>
        <p className="chooser-note">
          Your customer and provider conversations stay separate. You can change
          between them explicitly.
        </p>
      </div>
    </main>
  );
}
