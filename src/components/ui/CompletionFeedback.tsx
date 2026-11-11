import { useRef, useState } from "react";
import { ThumbsUp, ThumbsDown, XClose } from "@untitledui/icons";
import { FieldTextarea } from "./FieldTextarea";
import { read, write, storageScope } from "../../demo/storage";

/** Local feedback prototype; a real completed booking can supply its server-owned id later. */
export function CompletionFeedback({
  recordId,
  role,
}: {
  recordId: string;
  role: "customer" | "provider";
}) {
  const key = `mono-${role}-feedback-${recordId}`;
  const [saved, setSaved] = useState(() => Boolean(read(key)));
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [text, setText] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [scope, setScope] = useState(() => storageScope(key));
  const up = useRef<HTMLButtonElement>(null);
  const down = useRef<HTMLButtonElement>(null);
  function close() {
    const trigger = rating === "up" ? up : down;
    setRating(null);
    requestAnimationFrame(() => trigger.current?.focus());
  }
  if (dismissed) return null;
  return (
    <section
      className="completion-feedback"
      aria-label="Feedback on this demo step"
    >
      {saved ? (
        <p role="status">
          Thanks — feedback saved{" "}
          {scope === "session" ? "for this visit only" : "on this device"}. It
          hasn’t been sent to GOMONO.
        </p>
      ) : rating ? (
        <form
          className="feedback-expanded"
          onSubmit={(e) => {
            e.preventDefault();
            write(
              key,
              JSON.stringify({
                rating,
                text: text.trim(),
                recordId,
                createdAt: new Date().toISOString(),
              }),
            );
            setScope(storageScope(key));
            setSaved(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              close();
            }
          }}
        >
          <button
            type="button"
            className="feedback-close"
            aria-label="Close feedback"
            onClick={close}
          >
            <XClose aria-hidden="true" width={18} height={18} />
          </button>
          <h4>Share feedback</h4>
          <p>
            {rating === "up" ? "What worked well?" : "What could work better?"}
          </p>
          <FieldTextarea
            label="Feedback (optional)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            rows={3}
            hint="Private local prototype. Avoid personal, payment or identity details."
          />
          <button type="submit" className="smallbtn">
            Save feedback on device
          </button>
          <button type="button" className="text-button" onClick={close}>
            Back
          </button>
        </form>
      ) : (
        <div className="feedback-invitation">
          <div>
            <b>How was that?</b>
            <small>
              {role === "provider"
                ? "Listing saved locally · not published"
                : "Request saved locally · no booking confirmed"}
            </small>
          </div>
          <button
            type="button"
            ref={up}
            aria-label="This step worked well"
            onClick={() => setRating("up")}
          >
            <ThumbsUp width={19} height={19} aria-hidden="true" />
          </button>
          <button
            type="button"
            ref={down}
            aria-label="This step could be better"
            onClick={() => setRating("down")}
          >
            <ThumbsDown width={19} height={19} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="feedback-close"
            aria-label="Dismiss feedback"
            onClick={() => setDismissed(true)}
          >
            <XClose width={16} height={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
