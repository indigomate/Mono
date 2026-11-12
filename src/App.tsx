import { useWorkspaceViewport } from "./hooks/useWorkspaceViewport";
import { VehicleBrandLoop } from "./components/VehicleBrandLoop";
import { WorkspaceBoundary } from "./components/WorkspaceBoundary";
import { ProductPreview } from "./components/ProductPreview";
import { LoadingIndicator } from "./components/ui/LoadingIndicator";
import { Button } from "./components/base/buttons/button";
import { ArrowUpRight } from "@untitledui/icons";
import { useLandingReveal } from "./hooks/useLandingReveal";
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
  useLandingReveal(view === "home");
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
            <Button
              color="ghost"
              className="outline"
              iconTrailing={<ArrowUpRight width={15} height={15} />}
              onPress={() => navigate("provider")}
            >
              List Your Car
            </Button>
          </nav>
        </header>
        <section className="hero">
          <div className="hero-content" data-reveal="hero">
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
              <Button
                size="lg"
                className="primary"
                iconTrailing={<ArrowUpRight width={15} height={15} />}
                onPress={() => navigate("customer")}
              >
                Book a Car
              </Button>
              <Button
                size="lg"
                color="ghost"
                className="secondary"
                iconTrailing={<ArrowUpRight width={15} height={15} />}
                onPress={() => navigate("provider")}
              >
                List Your Car
              </Button>
            </div>
            <div className="hero-service-line" aria-label="Ways to move">
              <span>Self-drive</span>
              <span>With a driver</span>
              <span>Group transport</span>
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
          <div className="eyebrow" data-reveal="fade-up">
            HOW IT WORKS
          </div>
          <h2 data-reveal="fade-up">Your plans. One conversation.</h2>
          <div className="feature-grid">
            <div className="feature" data-reveal="fade-up">
              <b>01 — Tell us your plans</b>
              <p>Where, when and how you want to travel.</p>
            </div>
            <div className="feature" data-reveal="fade-up">
              <b>02 — Explore the options</b>
              <p>Compare vehicles or find a service with a driver.</p>
            </div>
            <div className="feature" data-reveal="fade-up">
              <b>03 — Review your request</b>
              <p>
                Check the details and save your request. Live booking is coming
                next.
              </p>
            </div>
          </div>
          <div
            id="for-owners"
            className="minimal-owner-entry"
            data-reveal="fade-up"
          >
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
          <strong>GOMONO.</strong>
          <span>
            Concept MVP · Demonstration listings and booking requests only.
          </span>
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
