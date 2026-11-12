import { useRef, useState } from "react";
import { Bookmark, CheckCircle } from "@untitledui/icons";
import { LoadingExperience } from "./LoadingExperience";

/** Acknowledges the actual save callback; never simulates completion with timers. */
export function SaveToggle({
  isSaved,
  scope,
  name,
  onChange,
}: {
  isSaved: boolean;
  scope: "device" | "session";
  name: string;
  onChange: (saved: boolean) => void | Promise<void>;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);
  async function toggle() {
    if (busy.current) return;
    busy.current = true;
    setError("");
    try {
      const result = onChange(!isSaved);
      if (result && typeof result.then === "function") {
        setPending(true);
        await result;
      }
    } catch {
      setError("Couldn’t save. Try again.");
    } finally {
      setPending(false);
      busy.current = false;
    }
  }
  const Icon = isSaved ? CheckCircle : Bookmark;
  return (
    <div className="save-toggle-slot">
      <button
        type="button"
        className="save-toggle"
        data-saved={isSaved}
        aria-pressed={isSaved}
        aria-label={`${isSaved ? "Remove" : "Save"} ${name}${isSaved ? " from saved cars" : ""}`}
        aria-busy={pending}
        disabled={pending}
        onClick={() => void toggle()}
      >
        {pending ? (
          <LoadingExperience
            variant="action"
            label="Saving…"
            announce={false}
          />
        ) : (
          <>
            <Icon aria-hidden="true" width={17} height={17} />
            <span>
              {isSaved
                ? scope === "session"
                  ? "Saved (visit)"
                  : "Saved"
                : "Save car"}
            </span>
          </>
        )}
      </button>
      {error && <small role="alert">{error}</small>}
    </div>
  );
}
