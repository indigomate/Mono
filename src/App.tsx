import { VehicleBrandLoop } from "./components/VehicleBrandLoop";
import { WorkspaceBoundary } from "./components/WorkspaceBoundary";
import { ProductPreview } from "./components/ProductPreview";
import { LoadingIndicator } from "./components/ui/LoadingIndicator";
import { useEffect, useState, lazy, Suspense } from "react";
import type { View } from "./workspace/navigation";
const Workspace = lazy(() =>
  import("./workspace/Workspace").then((module) => ({
    default: module.Workspace,
  })),
);
import { validViews } from "./workspace/navigation";
function currentView(): View | "home" {
  const hash = location.hash.slice(1);
  return validViews.includes(hash)
    ? (hash as View)
    : hash === "app"
      ? "chat"
      : "home";
}
export default function App() {
  const [entry, setEntry] = useState<{
    role: "customer" | "provider";
    text: string;
  } | null>(null);
  const [view, setView] = useState<View | "home">(currentView);
  useEffect(() => {
    const sync = () => setView(currentView());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  function navigate(next: View | "home") {
    location.hash = next === "home" ? "" : next;
    setView(next);
    window.scrollTo(0, 0);
  }
  return (
    <div
      className={
        view === "home" ? "app-root" : "app-root app-conversation-root"
      }
    >
      <div id="storage-status" role="status" />
      <div id="landing" className="landing" hidden={view !== "home"}>
        <header className="nav">
          <a href="#" className="logo">
            GOMONO<span style={{ color: "#999" }}>.</span>
          </a>
          <nav className="navlinks">
            <a href="#experience">Try the experience</a>
            <a href="#how">How it works</a>
            <a href="#for-owners">For owners</a>
            <button className="outline" onClick={() => navigate("provider")}>
              List Your Car{" "}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 19 19 5M5 5h14v14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </nav>
        </header>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">A new way to move · Cape Town</div>
            <h1>
              RENT
              <br />
              SMARTER<span className="hero-dot">.</span>
            </h1>
            <p>
              Just a conversation away. Tell us where you're going. Your
              personal AI rental concierge helps you discover the right car,
              from private owners, fleets and transport providers. Drive
              yourself or choose a service with a driver.
            </p>
            <div className="actions">
              <button className="primary" onClick={() => navigate("customer")}>
                Book a Car{" "}
                <span className="arrow">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 19 19 5M5 5h14v14"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <button
                className="secondary"
                onClick={() => navigate("provider")}
              >
                List Your Car{" "}
                <span className="arrow">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 19 19 5M5 5h14v14"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
            <a className="experience-link" href="#experience">
              See the interface in action <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        <div className="landing-bottom">
          <span>01 / DISCOVER    02 / MATCH    03 / REQUEST TO BOOK</span>
          <span>THE FUTURE OF RENTAL IS CONVERSATIONAL</span>
        </div>
        <VehicleBrandLoop />
        <div id="experience">
          <ProductPreview
            onStart={(role, text) => {
              setEntry({ role, text });
              navigate(role);
            }}
          />
        </div>
        <section id="how" className="features">
          <div className="eyebrow" style={{ color: "#777" }}>
            DESIGNED AROUND YOU
          </div>
          <h2>No filters. No endless scrolling. Just tell us what you need.</h2>
          <div className="feature-grid">
            <div className="feature">
              <b>01 — Tell us your plans</b>
              <p>
                A wedding, a weekend escape, or a business trip. Start with a
                simple conversation.
              </p>
            </div>
            <div className="feature">
              <b>02 — Discover your match</b>
              <p>
                Explore sample cars by budget and occasion. Live dates and
                verified availability are coming next.
              </p>
            </div>
            <div className="feature" id="for-owners">
              <b>03 — Your business, elevated</b>
              <p>
                Private owners, fleets and chauffeur operators get a dedicated
                studio, service management, and booking requests in one place.
              </p>
            </div>
          </div>
        </section>
        <footer className="footer">
          GOMONO.  ·  Concept MVP · Demonstration listings and booking requests
          only.
        </footer>
      </div>
      {view !== "home" && (
        <WorkspaceBoundary pendingEntry={entry?.text}>
          <Suspense
            fallback={
              <div className="conversation-loading">
                <LoadingIndicator />
              </div>
            }
          >
            <Workspace
              view={view}
              navigate={navigate}
              entry={entry}
              onEntryConsumed={() => setEntry(null)}
            />
          </Suspense>
        </WorkspaceBoundary>
      )}
    </div>
  );
}
