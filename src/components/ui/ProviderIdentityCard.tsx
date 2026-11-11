import { useId, useState } from "react";
import type { ProviderProfile } from "../../demo/services";
import { serviceLabel } from "../../demo/services";
import { Building02, ChevronDown } from "@untitledui/icons";
/** Only saved business fields: no fabricated analytics, verification or people. */
export function ProviderIdentityCard({
  profile,
}: {
  profile: ProviderProfile;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <section
      className="provider-identity-card"
      aria-label="Business profile preview"
    >
      <button
        type="button"
        className="provider-identity-trigger"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        <span className="identity-icon">
          <Building02 aria-hidden="true" width={24} height={24} />
        </span>
        <span>
          <strong>
            {profile.name || "Your rental & transport collection"}
          </strong>
          <small>Business details · local preview</small>
        </span>
        <ChevronDown
          aria-hidden="true"
          width={20}
          height={20}
          style={{ transform: open ? "rotate(180deg)" : undefined }}
        />
      </button>
      {open && (
        <div id={id} className="provider-identity-body">
          <dl>
            <div>
              <dt>Location</dt>
              <dd>{profile.area || "Not added"}</dd>
            </div>
            <div>
              <dt>Provider type</dt>
              <dd>
                {
                  {
                    "private-owner": "Private owner",
                    "fleet-business": "Fleet business",
                    "chauffeur-operator": "Chauffeur operator",
                    mixed: "Mixed services",
                  }[profile.kind]
                }
              </dd>
            </div>
            <div>
              <dt>Services</dt>
              <dd>
                {profile.services.map(serviceLabel).join(" · ") || "Not added"}
              </dd>
            </div>
            <div>
              <dt>Verification</dt>
              <dd>Not connected</dd>
            </div>
          </dl>
          <p>
            {profile.description || "Add a description in Business profile."}
          </p>
          <small>
            Private preview. No public storefront has been published.
          </small>
        </div>
      )}
    </section>
  );
}
