import { useState } from "react";
import { LoadingExperience } from "./LoadingExperience";
/** Fixed space while the actual image loads, with a usable failure/retry state. */
export function VehiclePhoto({ src, alt }: { src: string; alt: string }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  return (
    <>
      <img
        key={attempt}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setState("ready")}
        onError={() => setState("error")}
        style={{ opacity: state === "ready" ? 1 : 0 }}
      />
      {state !== "ready" && (
        <div className="vehicle-photo-placeholder" data-state={state}>
          {state === "loading" ? (
            <LoadingExperience variant="media" label="Loading vehicle photo" />
          ) : (
            <>
              <span>Photo unavailable</span>
              <button
                type="button"
                onClick={() => {
                  setState("loading");
                  setAttempt((n) => n + 1);
                }}
              >
                Retry photo
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
