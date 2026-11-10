import { Component, type ReactNode } from "react";

/** Keep a failed lazy workspace load from taking down the entire app. */
export class WorkspaceBoundary extends Component<
  { children: ReactNode; pendingEntry?: string },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section
        className="workspace-recovery"
        role="alert"
        aria-labelledby="workspace-recovery-title"
      >
        <div>
          <span className="eyebrow">GOMONO / LET’S GET YOU BACK</span>
          <h2 id="workspace-recovery-title">
            Your conversation couldn’t open.
          </h2>
          <p>
            A connection issue or an app update may have interrupted loading.
            Reload to try again. Your saved requests and drafts stay on this
            device.
          </p>
          {this.props.pendingEntry && (
            <>
              <p>Copy your unsent message before reloading:</p>
              <blockquote aria-label="Your unsent message">
                {this.props.pendingEntry}
              </blockquote>
            </>
          )}
          <div className="recovery-actions">
            <button onClick={() => window.location.reload()}>
              Reload GOMONO
            </button>
            <a href={window.location.pathname + window.location.search}>
              Back to website
            </a>
          </div>
        </div>
      </section>
    );
  }
}
