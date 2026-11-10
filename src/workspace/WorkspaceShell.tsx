import { useEffect, useRef, type ReactNode } from "react";
import { type View, type Navigate } from "./navigation";
const customerLinks = [
  { view: "customer", label: "My dashboard", icon: "◇" },
  { view: "chat", label: "Find a vehicle", icon: "✧" },
  { view: "bookings", label: "My requests", icon: "▤" },
] as const;
const providerLinks = [
  { view: "provider", label: "Overview", icon: "◇" },
  { view: "provider-profile", label: "Provider profile", icon: "○" },
  { view: "owner", label: "Vehicles & services", icon: "▦" },
  { view: "provider-requests", label: "Incoming requests", icon: "▤" },
  { view: "store", label: "Storefront preview", icon: "✧" },
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
  const label = active?.label || "Service enquiry";
  useEffect(() => {
    title.current?.focus();
  }, [view]);
  return (
    <div className={`workspace role-${role}`}>
      <aside className="workspace-sidebar">
        <button className="logo home-brand" onClick={() => navigate("home")}>
          MONO.
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
              MONO / {provider ? "PROVIDER STUDIO" : "RENT & RIDE"}
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
              aria-current={view === l.view ? "page" : undefined}
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
            MONO · Back to website
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
  return (
    <main className="workspace-chooser">
      <button className="logo" onClick={() => navigate("home")}>
        MONO.
      </button>
      <div className="eyebrow">ONE MARKETPLACE. TWO PURPOSES.</div>
      <h1>
        What brings you
        <br />
        to MONO?
      </h1>
      <p>Choose the workspace that fits what you want to do.</p>
      <div className="workspace-choice-grid">
        <button onClick={() => navigate("customer")}>
          <span>01 / CUSTOMER</span>
          <h2>I want to rent or ride.</h2>
          <p>
            Find a self-drive vehicle, book a chauffeur, or plan transport for
            any occasion.
          </p>
          <b>Enter Rent & Ride →</b>
        </button>
        <button onClick={() => navigate("provider")}>
          <span>02 / PROVIDER</span>
          <h2>I have vehicles or services.</h2>
          <p>
            Manage your private vehicle, fleet or chauffeur business in one
            dedicated studio.
          </p>
          <b>Enter Provider Studio →</b>
        </button>
      </div>
      <p className="chooser-note">
        You can use both workspaces. Demo switching does not create an account
        or grant access to another provider’s data.
      </p>
    </main>
  );
}
