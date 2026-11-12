import "./loading-experience.css";

export type LoadingVariant = "workspace" | "reply" | "media" | "qr" | "action";

export function LoadingExperience({
  variant,
  label,
  announce = true,
}: {
  variant: LoadingVariant;
  label: string;
  announce?: boolean;
}) {
  const content = (
    <>
      <span className="gomono-load-visual" aria-hidden="true">
        {variant === "action" ? (
          <span className="gomono-action-wheel" />
        ) : (
          <img
            src="/design/gomono-loader.png"
            alt=""
            draggable={false}
            decoding="async"
          />
        )}
        {variant === "reply" && (
          <span className="reply-dots gomono-route-pips">
            <i style={{ animationName: "none" }} />
            <i style={{ animationName: "none" }} />
            <i style={{ animationName: "none" }} />
          </span>
        )}
        {variant === "qr" && <span className="gomono-qr-scan" />}
      </span>
      {label && <span className="gomono-load-label">{label}</span>}
    </>
  );

  return announce ? (
    <div
      className={`gomono-load gomono-load-${variant}`}
      role="status"
      aria-label={label}
    >
      {content}
    </div>
  ) : (
    <span className={`gomono-load gomono-load-${variant}`}>{content}</span>
  );
}
