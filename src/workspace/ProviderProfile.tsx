import { useState } from "react";
import {
  services,
  type ProviderProfile as Profile,
  type ServiceType,
} from "../demo/services";
export const providerKindLabel = (kind: Profile["kind"]) =>
  ({
    "private-owner": "Private owner",
    "fleet-business": "Rental / fleet business",
    "chauffeur-operator": "Chauffeur / transport operator",
    mixed: "Multi-service provider",
  })[kind];
export function ProviderProfile({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (profile: Profile) => void;
}) {
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  return (
    <>
      <div className="eyebrow">PROVIDER STUDIO / YOUR BUSINESS</div>
      <h2 className="page-title">Make it your own.</h2>
      <p className="muted">
        Your provider identity is separate from a customer’s rental or ride
        request.
      </p>
      <form
        className="provider-profile-form"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const name = String(f.get("name")).trim(),
            area = String(f.get("area")).trim(),
            selected = f.getAll("services") as ServiceType[];
          if (!name || !area || !selected.length) {
            setError(
              "Add your provider name, service area and at least one service.",
            );
            setNotice("");
            return;
          }
          onSave({
            name,
            area,
            kind: f.get("kind") as Profile["kind"],
            services: selected,
            description: String(f.get("description")).trim(),
          });
          setNotice(
            "Provider profile saved on this device. Verification is not yet available.",
          );
          setError("");
        }}
      >
        <h3>Who is providing the service?</h3>
        <div className="fields-grid">
          <label>
            Provider or business name
            <input
              name="name"
              required
              maxLength={120}
              defaultValue={profile.name}
              placeholder="Your name or registered business"
            />
          </label>
          <label>
            Provider type
            <select
              aria-label="Provider type"
              name="kind"
              defaultValue={profile.kind}
            >
              <option value="private-owner">Private owner</option>
              <option value="fleet-business">Rental / fleet business</option>
              <option value="chauffeur-operator">
                Chauffeur / transport operator
              </option>
              <option value="mixed">Multi-service provider</option>
            </select>
          </label>
          <label>
            Service area
            <input
              name="area"
              required
              maxLength={120}
              defaultValue={profile.area}
            />
          </label>
        </div>
        <fieldset className="service-checkboxes">
          <legend>Which services do you offer?</legend>
          <p className="muted">
            Your provider type does not limit your services. A private owner or
            fleet can offer more than one.
          </p>
          {services.map((s) => (
            <label className="check-field" key={s.id}>
              <input
                type="checkbox"
                name="services"
                value={s.id}
                defaultChecked={profile.services.includes(s.id)}
              />
              {s.label}
            </label>
          ))}
        </fieldset>
        <label>
          About your business
          <textarea
            name="description"
            maxLength={1200}
            defaultValue={profile.description}
            placeholder="Describe your vehicles, transport services and service area."
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="success-note" role="status">
            {notice}
          </p>
        )}
        <p className="notice">
          This is a local draft profile. Documents, driver credentials,
          insurance, payouts and public verification are not connected yet.
        </p>
        <button className="smallbtn">Save provider profile</button>
      </form>
    </>
  );
}
