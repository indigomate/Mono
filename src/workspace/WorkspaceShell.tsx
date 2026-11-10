import { FieldInput } from "../components/ui/FieldInput";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { type View, type Navigate } from "./navigation";
const customerLinks = [
  { view: "customer", label: "Customer conversation", icon: "✧" },
] as const;
const providerLinks = [
  { view: "provider", label: "Provider conversation", icon: "✧" },
] as const;
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
  const links = provider ? providerLinks : customerLinks;
  const active = links.find((l) => l.view === view);
  const label = provider ? "Provider assistant" : "Customer concierge";
  useEffect(() => {
    title.current?.focus();
  }, [view]);
  return (
    <div className={`workspace chat-layout role-${role}`}>
      <aside className="workspace-sidebar">
        <button className="logo home-brand" onClick={() => navigate("home")}>
          GOMONO.
        </button>
        <div className="workspace-identity">
          <span>{provider ? "PROVIDER STUDIO" : "RENT & RIDE"}</span>
          <small>
            {provider
              ? "Your business. Your services."
              : "Your plans. Your way."}
          </small>
        </div>
        <nav
          aria-label={provider ? "Provider navigation" : "Customer navigation"}
        >
          {links.map((l) => (
            <button
              key={l.view}
              id={`nav-${l.view}`}
              aria-current="page"
              className="ws-nav active"
              onClick={() => navigate(l.view)}
            >
              <span aria-hidden="true">{l.icon}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </nav>
        <div className="workspace-sidebar-foot">
          <button onClick={() => navigate("workspaces")}>
            Change workspace →
          </button>
          <p>
            <span className="live-dot" />
            {provider ? "Provider workspace" : "Customer workspace"}
            <br />
            Cape Town · Demo experience
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
              GOMONO / {provider ? "PROVIDER STUDIO" : "RENT & RIDE"}
            </span>
            <strong>{label}</strong>
          </div>
          <div className="workspace-top-actions">
            <button
              className="text-button workspace-switch"
              onClick={() => navigate("workspaces")}
            >
              Change workspace
            </button>
            <span className="demo-pill">
              <i />
              {provider ? "Provider demo" : "Customer demo"}
            </span>
          </div>
        </header>
        <nav
          className="workspace-mobile-nav"
          aria-label={
            provider
              ? "Mobile provider navigation"
              : "Mobile customer navigation"
          }
        >
          {links.map((l) => (
            <button
              key={l.view}
              aria-current="page"
              onClick={() => navigate(l.view)}
            >
              {l.label}
            </button>
          ))}
        </nav>
        <div className="workspace-content">
          <h1 className="sr-only" ref={title} tabIndex={-1}>
            {label}
          </h1>
          {children}
        </div>
        <footer className="workspace-footer">
          <button
            className="text-button"
            aria-label="Return to website"
            onClick={() => navigate("home")}
          >
            GOMONO · Back to website
          </button>
          <span>
            {provider ? "Provider Studio" : "Rent & Ride"} · Demonstration only
          </span>
        </footer>
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
            <button onClick={() => navigate("customer")}>
              I want to rent or ride
            </button>
            <button onClick={() => navigate("provider")}>
              I provide vehicles or services
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
