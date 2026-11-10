import type { ReactNode } from "react";
import { ProgressBar } from "react-aria-components";

/** MONO compositions, not Untitled UI PRO demo source. */
export function InlineCTA({
  title,
  children,
  action,
  onAction,
}: {
  title: string;
  children: ReactNode;
  action: string;
  onAction: () => void;
}) {
  return (
    <aside className="mono-inline-cta">
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
      <button type="button" className="smallbtn" onClick={onAction}>
        {action}
      </button>
    </aside>
  );
}
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mono-empty">
      <span aria-hidden="true">✧</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export function BriefProgress({
  checks,
}: {
  checks: { label: string; complete: boolean }[];
}) {
  const complete = checks.filter((c) => c.complete).length;
  return (
    <ProgressBar
      className="mono-progress"
      aria-label="Brief completeness"
      value={complete}
      maxValue={checks.length}
    >
      <div className="mono-progress-heading">
        <span>Brief details</span>
        <span>
          {complete} of {checks.length}
        </span>
      </div>
      <div className="mono-progress-track">
        <div style={{ width: `${(complete / checks.length) * 100}%` }} />
      </div>
      <ul>
        {checks.map((c) => (
          <li key={c.label}>
            <span aria-hidden="true">{c.complete ? "✓" : "○"}</span> {c.label}
            <span className="sr-only">
              {c.complete ? ": included" : ": missing"}
            </span>
          </li>
        ))}
      </ul>
    </ProgressBar>
  );
}
export function LocalMetrics({
  saved,
  preview,
}: {
  saved: number;
  preview: number;
}) {
  return (
    <dl className="mono-metrics">
      <div>
        <dt>Saved listings</dt>
        <dd>{saved}</dd>
      </div>
      <div>
        <dt>In local preview</dt>
        <dd>{preview}</dd>
      </div>
    </dl>
  );
}
