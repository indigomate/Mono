import { useEffect, useRef } from "react";
import { initializeExperience } from "./demo/experience";
export default function App() {
  const container = useRef<HTMLDivElement>(null);
  const actions = useRef<ReturnType<typeof initializeExperience> | null>(null);
  useEffect(() => {
    actions.current = initializeExperience(container.current!);
    return () => actions.current?.dispose();
  }, []);
  return (
    <div ref={container}>
      <div id="storage-status" role="status"></div>
      <div id="landing" className="landing">
        <header className="nav">
          <a href="#" className="logo">
            MONO<span style={{ color: "#999" }}>.</span>
          </a>
          <nav className="navlinks">
            <a href="#how">How it works</a>
            <a href="#for-owners">For owners</a>
            <button
              className="outline"
              onClick={() => actions.current?.enter("owner")}
            >
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
              from local providers. Explore the Cape Town demo below.
            </p>
            <div className="actions">
              <button
                className="primary"
                onClick={() => actions.current?.enter("chat")}
              >
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
                onClick={() => actions.current?.enter("owner")}
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
        <div className="landing-bottom">
          <span>01 / DISCOVER    02 / MATCH    03 / REQUEST TO BOOK</span>
          <span>THE FUTURE OF RENTAL IS CONVERSATIONAL</span>
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
                Rental owners get a dedicated storefront, fleet management, and
                booking requests in one place.
              </p>
            </div>
          </div>
        </section>
        <footer className="footer">
          MONO.  ·  Concept MVP · Demonstration listings and booking requests
          only.
        </footer>
      </div>
      <div id="app" className="app hidden">
        <aside className="sidebar">
          <div className="logo">MONO.</div>
          <button
            className="navbtn active"
            id="nav-chat"
            aria-label="AI concierge"
            onClick={() => actions.current?.showView("chat")}
          >
            ✧ <span className="label">AI concierge</span>
          </button>
          <button
            className="navbtn"
            id="nav-bookings"
            aria-label="My requests"
            onClick={() => actions.current?.showView("bookings")}
          >
            ▤ <span className="label">My requests</span>
          </button>
          <button
            className="navbtn"
            id="nav-owner"
            aria-label="Owner workspace"
            onClick={() => actions.current?.showView("owner")}
          >
            ▦ <span className="label">Owner workspace</span>
          </button>
          <button
            className="navbtn"
            id="nav-store"
            aria-label="My storefront"
            onClick={() => actions.current?.showView("store")}
          >
            ◇ <span className="label">My storefront</span>
          </button>
          <div className="sidebar-foot">
            Prototype experience
            <br />
            <button onClick={() => actions.current?.goHome()}>
              ← Back to website
            </button>
          </div>
        </aside>
        <main className="main">
          <nav className="mobile-tabs" aria-label="Workspace">
            <button onClick={() => actions.current?.showView("chat")}>
              Concierge
            </button>
            <button onClick={() => actions.current?.showView("bookings")}>
              Requests
            </button>
            <button onClick={() => actions.current?.showView("owner")}>
              Owner
            </button>
            <button onClick={() => actions.current?.showView("store")}>
              Storefront
            </button>
          </nav>
          <div className="topbar">
            <button
              className="mobile-menu"
              aria-label="Back to website"
              onClick={() => actions.current?.goHome()}
            >
              ←
            </button>
            <strong id="view-title">Your concierge</strong>
            <button
              className="location"
              onClick={() => actions.current?.changeLocation()}
            >
              ⌖ <span id="city-label">Cape Town</span> ▾
            </button>
          </div>
          <div
            id="chat-view"
            style={{
              display: "flex",
              flex: "1",
              minHeight: "0",
              flexDirection: "column",
            }}
          >
            <div className="conversation" id="scroll">
              <div
                className="conversation-inner"
                id="thread"
                aria-live="polite"
              >
                <div className="intro">
                  <div className="spark">✳</div>
                  <h1>Where can we take you?</h1>
                  <p>
                    Tell me your plans. I'll help you find the right rental.
                  </p>
                </div>
                <div className="suggestions" id="suggestions">
                  <button
                    className="chip"
                    onClick={() =>
                      actions.current?.suggest(
                        "I need a car for a wedding in Cape Town",
                      )
                    }
                  >
                    ✦ A car for a wedding
                  </button>
                  <button
                    className="chip"
                    onClick={() =>
                      actions.current?.suggest(
                        "I need an SUV for a weekend getaway",
                      )
                    }
                  >
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
                    </svg>{" "}
                    Weekend getaway
                  </button>
                  <button
                    className="chip"
                    onClick={() =>
                      actions.current?.suggest(
                        "I need a luxury sedan for business travel",
                      )
                    }
                  >
                    ◈ Business travel
                  </button>
                  <button
                    className="chip"
                    onClick={() =>
                      actions.current?.suggest("Show me affordable cars nearby")
                    }
                  >
                    ⌖ Affordable cars nearby
                  </button>
                </div>
              </div>
            </div>
            <div className="composer-wrap">
              <form
                className="composer"
                onSubmit={(event) => actions.current?.send(event)}
              >
                <span style={{ paddingLeft: "9px", color: "#999" }}>✳</span>
                <input
                  id="prompt"
                  aria-label="Message your concierge"
                  placeholder="Ask for a car, a destination, or an occasion..."
                  autoComplete="off"
                />
                <button className="send" aria-label="Send message">
                  ↑
                </button>
              </form>
              <div className="disclaimer">
                Demo inventory only · Booking requests are not real reservations
              </div>
            </div>
          </div>
          <div id="panel-view" className="panel hidden"></div>
        </main>
      </div>
    </div>
  );
}
