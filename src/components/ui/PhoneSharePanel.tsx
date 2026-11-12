import { useEffect, useState } from "react";
import type { QRCode as QRComponent } from "../shared-assets/qr-code";
import { LoadingExperience } from "./LoadingExperience";

export const PUBLIC_DEMO_URL = "https://mono-ochre-psi.vercel.app/";
const QR_OPTIONS = {
  width: 192,
  height: 192,
  margin: 24,
  dotsOptions: { color: "#0b2920", type: "square" as const },
  backgroundOptions: { color: "#ffffff" },
  qrOptions: { errorCorrectionLevel: "M" as const },
};

/** Public entry links only: never encode a local draft or payment token. */
export function PhoneSharePanel({
  role,
  id,
}: {
  role: "customer" | "provider";
  id: string;
}) {
  const [QR, setQR] = useState<typeof QRComponent | null>(null);
  const [failed, setFailed] = useState(false);
  const href = `${PUBLIC_DEMO_URL}#${role}`;
  useEffect(() => {
    let active = true;
    import("../shared-assets/qr-code")
      .then((module) => {
        if (active) setQR(() => module.QRCode);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <aside
      id={id}
      className="phone-share-panel"
      aria-label="Open public demo on your phone"
    >
      <div>
        <h3>Take a look on your phone.</h3>
        <p>
          Scan to open the public{" "}
          {role === "customer" ? "customer" : "provider"} demo. Your local
          drafts and conversation are not transferred.
        </p>
        <a href={href}>{href}</a>
        <small>This is not a booking pass or payment QR code.</small>
      </div>
      <div
        className="public-demo-qr"
        role="img"
        aria-label={`QR code for public ${role} demo`}
      >
        {QR ? (
          <QR value={href} size="lg" options={QR_OPTIONS} />
        ) : failed ? (
          <p role="alert">QR unavailable. Use the link instead.</p>
        ) : (
          <LoadingExperience variant="qr" label="Preparing QR code…" />
        )}
      </div>
    </aside>
  );
}
