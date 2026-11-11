import { ProviderIdentityCard } from "../components/ui/ProviderIdentityCard";
import { Toggle } from "../components/base/toggle/toggle";
import {
  BriefProgress,
  EmptyState,
  InlineCTA,
} from "../components/ui/ConversationElements";
import { FieldSelect } from "../components/ui/FieldSelect";
import { FieldTextarea } from "../components/ui/FieldTextarea";
import { FieldInput } from "../components/ui/FieldInput";
import { type Draft, money } from "../demo/marketplace";
import {
  services,
  vehicleTypes,
  serviceLabel,
  type ProviderProfile,
  type ServiceType,
} from "../demo/services";
export function ListingCard({
  draft,
  onChange,
  onSave,
  onCancel,
}: {
  draft: Draft;
  onChange: (draft: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    onChange({ ...draft, [key]: value });
  return (
    <form
      className="listing-editor controlled-listing"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <h3>Review your listing draft</h3>
      <p className="muted">
        Tell me what to change, or edit these fields. Nothing is published.
      </p>
      <BriefProgress
        checks={[
          { label: "Listing name", complete: Boolean(draft.name.trim()) },
          { label: "Service area", complete: Boolean(draft.area.trim()) },
          { label: "Services", complete: draft.services.length > 0 },
          {
            label: "Pricing basis",
            complete: draft.rateUnit === "quote" || draft.price > 0,
          },
        ]}
      />
      <div className="fields-grid">
        <FieldInput
          required
          maxLength={100}
          value={draft.name}
          onChange={(e) => update("name", e.target.value)}
          label="Listing name"
        />
        <FieldSelect
          aria-label="Vehicle category"
          value={draft.vehicleType}
          onChange={(e) => update("vehicleType", e.target.value)}
          label="Vehicle category"
          options={[...vehicleTypes.map((v) => ({ label: v, value: v }))]}
        />
        <FieldInput
          required
          maxLength={100}
          value={draft.area}
          onChange={(e) => update("area", e.target.value)}
          label="Service area"
        />
        <FieldInput
          type="number"
          required
          min="1"
          max="100"
          value={draft.seats}
          onChange={(e) => update("seats", Number(e.target.value))}
          label="Seats / passenger capacity"
        />
        <FieldSelect
          aria-label="Transmission"
          value={draft.transmission}
          onChange={(e) => update("transmission", e.target.value)}
          label="Transmission"
          options={[
            { label: "Not applicable", value: "Not applicable" },
            { label: "Automatic", value: "Automatic" },
            { label: "Manual", value: "Manual" },
          ]}
        />
        <FieldSelect
          aria-label="Pricing basis"
          value={draft.rateUnit}
          onChange={(e) =>
            update("rateUnit", e.target.value as Draft["rateUnit"])
          }
          label="Pricing basis"
          options={[
            { label: "Per day", value: "day" },
            { label: "Per hour", value: "hour" },
            { label: "Per trip", value: "trip" },
            { label: "Per month", value: "month" },
            { label: "Custom quote only", value: "quote" },
          ]}
        />
        {draft.rateUnit !== "quote" && (
          <FieldInput
            type="number"
            min="1"
            max="10000000"
            required
            value={draft.price}
            onChange={(e) => update("price", Number(e.target.value))}
            label="Reference rate (ZAR)"
            hint="Reference only; each service may need its own quote."
            prefix="R"
          />
        )}
      </div>
      <fieldset className="service-checkboxes">
        <legend>Services offered</legend>
        {services.map((s) => (
          <label className="check-field" key={s.id}>
            <input
              type="checkbox"
              checked={draft.services.includes(s.id)}
              onChange={(e) =>
                update(
                  "services",
                  e.target.checked
                    ? [...draft.services, s.id]
                    : draft.services.filter((v) => v !== s.id),
                )
              }
            />
            {s.label}
          </label>
        ))}
      </fieldset>
      <FieldTextarea
        maxLength={1000}
        value={draft.notes}
        onChange={(e) => update("notes", e.target.value)}
        label="Vehicle & service notes"
      />
      <p className="notice">
        Reference rates are not verified quotes. Driver credentials, documents
        and availability remain unverified.
      </p>
      <div className="inline-actions">
        <button className="smallbtn">Save listing draft</button>
        <button type="button" onClick={onCancel}>
          Keep as unfinished draft
        </button>
      </div>
    </form>
  );
}
export function ProfileCard({
  profile,
  onChange,
  onSave,
}: {
  profile: ProviderProfile;
  onChange: (profile: ProviderProfile) => void;
  onSave: () => void;
}) {
  const update = <K extends keyof ProviderProfile>(
    key: K,
    value: ProviderProfile[K],
  ) => onChange({ ...profile, [key]: value });
  return (
    <form
      className="provider-profile-form controlled-profile"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <h3>Your provider profile</h3>
      <p className="muted">
        Tell me about your business, or review the details here.
      </p>
      <BriefProgress
        checks={[
          { label: "Business name", complete: Boolean(profile.name.trim()) },
          { label: "Service area", complete: Boolean(profile.area.trim()) },
          { label: "Services offered", complete: profile.services.length > 0 },
          {
            label: "Business story",
            complete: Boolean(profile.description.trim()),
          },
        ]}
      />
      <div className="fields-grid">
        <FieldInput
          required
          maxLength={120}
          value={profile.name}
          onChange={(e) => update("name", e.target.value)}
          label="Provider or business name"
        />
        <FieldSelect
          aria-label="Provider type"
          value={profile.kind}
          onChange={(e) =>
            update("kind", e.target.value as ProviderProfile["kind"])
          }
          label="Provider type"
          options={[
            { label: "Private owner", value: "private-owner" },
            { label: "Rental / fleet business", value: "fleet-business" },
            {
              label: "Chauffeur / transport operator",
              value: "chauffeur-operator",
            },
            { label: "Multi-service provider", value: "mixed" },
          ]}
        />
        <FieldInput
          required
          maxLength={120}
          value={profile.area}
          onChange={(e) => update("area", e.target.value)}
          label="Service area"
        />
      </div>
      <fieldset className="service-checkboxes">
        <legend>Services offered</legend>
        {services.map((s) => (
          <label className="check-field" key={s.id}>
            <input
              type="checkbox"
              checked={profile.services.includes(s.id)}
              onChange={(e) =>
                update(
                  "services",
                  e.target.checked
                    ? [...profile.services, s.id]
                    : profile.services.filter((v) => v !== s.id),
                )
              }
            />
            {s.label}
          </label>
        ))}
      </fieldset>
      <FieldTextarea
        maxLength={1200}
        value={profile.description}
        onChange={(e) => update("description", e.target.value)}
        label="About your business"
      />
      <p className="notice">
        Saved locally only. Verification, documents and payouts are not
        connected.
      </p>
      <button className="smallbtn">Save provider profile</button>
    </form>
  );
}
export function FleetCards({
  drafts,
  onEdit,
  onPreview,
  onAdd,
}: {
  drafts: Draft[];
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="conversation-fleet">
      {!drafts.length ? (
        <EmptyState title="Your collection starts here">
          No saved listings yet. Tell me about your first vehicle or transport
          service.
        </EmptyState>
      ) : (
        drafts.map((d) => (
          <article className="draft-card" key={d.id}>
            <div className="draft-content">
              <span className="eyebrow">
                {d.status === "preview"
                  ? "LOCAL STOREFRONT PREVIEW"
                  : "SAVED DRAFT"}
              </span>
              <h3>{d.name}</h3>
              <p className="muted">
                {d.vehicleType} · {d.area} · {d.seats} seats
              </p>
              <div className="service-badges">
                {d.services.map((s) => (
                  <span key={s}>{serviceLabel(s)}</span>
                ))}
              </div>
              <div className="provider-readiness">
                <span>Availability unverified</span>
                <span>Documents pending</span>
              </div>
              <details className="decision-help">
                <summary>What this listing needs before launch</summary>
                <p>
                  Confirm availability, upload ownership or operating documents,
                  complete identity verification, and agree service-specific
                  pricing and cancellation terms. These checks are not yet
                  connected; this remains a local draft.
                </p>
              </details>
              <b>
                {d.rateUnit === "quote"
                  ? "Quote on request"
                  : `${money(d.price)} / ${d.rateUnit}`}
              </b>
              <div className="inline-actions">
                <button onClick={() => onEdit(d.id)}>Edit listing</button>
                <button onClick={() => onEdit(d.id)}>
                  Plan availability & service notes
                </button>
                <Toggle
                  className="gomono-toggle"
                  label="Include in local storefront preview"
                  aria-label="Include in local storefront preview"
                  isSelected={d.status === "preview"}
                  onChange={() => onPreview(d.id)}
                />
              </div>
            </div>
          </article>
        ))
      )}
      <InlineCTA
        title="Grow your collection"
        action="Add a listing →"
        onAction={onAdd}
      >
        Add a vehicle or transport service. Review the details in this
        conversation before saving.
      </InlineCTA>
    </div>
  );
}
export function StorefrontCard({
  profile,
  drafts,
}: {
  profile: ProviderProfile;
  drafts: Draft[];
}) {
  const visible = drafts.filter((d) => d.status === "preview");
  return (
    <div className="inline-storefront">
      <div className="storefront-hero">
        <span className="eyebrow">LOCAL PREVIEW / NOT PUBLICLY PUBLISHED</span>
        <ProviderIdentityCard profile={profile} />
      </div>
      {visible.length ? (
        visible.map((d) => (
          <article className="store-item" key={d.id}>
            <div>
              <h3>{d.name}</h3>
              <p>
                {d.vehicleType} · {d.area}
              </p>
              <p>{d.services.map(serviceLabel).join(" · ")}</p>
            </div>
            <strong>
              {d.rateUnit === "quote"
                ? "Quote on request"
                : `${money(d.price)} / ${d.rateUnit}`}
            </strong>
          </article>
        ))
      ) : (
        <p>
          No listings selected for preview. Ask to see your fleet and add one to
          the local preview.
        </p>
      )}
    </div>
  );
}
