import { useWorkspaceViewport } from "./hooks/useWorkspaceViewport";
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
  useWorkspaceViewport(view !== "home");
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
            <a href="#how">How it works</a>
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
              Find a car or a driver in Cape Town. Tell us your plans; we’ll
              help you explore the options.
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
          </div>
        </section>
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
          <div className="eyebrow">HOW IT WORKS</div>
          <h2>Your plans. One conversation.</h2>
          <div className="feature-grid">
            <div className="feature">
              <b>01 — Tell us your plans</b>
              <p>Where, when and how you want to travel.</p>
            </div>
            <div className="feature">
              <b>02 — Explore the options</b>
              <p>Compare vehicles or find a service with a driver.</p>
            </div>
            <div className="feature">
              <b>03 — Review your request</b>
              <p>
                Check the details and save your request. Live booking is coming
                next.
              </p>
            </div>
          </div>
          <div id="for-owners" className="minimal-owner-entry">
            <div>
              <h3>Have a car or transport business?</h3>
              <p>Prepare your listings and services in your own workspace.</p>
            </div>
            <button className="smallbtn" onClick={() => navigate("provider")}>
              List Your Car →
            </button>
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
