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
import { useState } from "react";
import {
  services,
  vehicleTypes,
  serviceLabel,
  type ProviderProfile,
  type ServiceType,
} from "../demo/services";
import {
  needsDriverDocuments,
  providerReadiness,
  type ReadinessStepId,
} from "./providerReadiness";
export function ListingCard({
  draft,
  profile,
  onChange,
  onSave,
  onCancel,
  onOpenProfile,
}: {
  draft: Draft;
  profile: ProviderProfile;
  onChange: (draft: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
  onOpenProfile: () => void;
}) {
  const steps = providerReadiness(draft, profile);
  const [activeStep, setActiveStep] = useState<ReadinessStepId>("basics");
  const step = steps.find((item) => item.id === activeStep) || steps[0];
  const stepIndex = steps.findIndex((item) => item.id === activeStep);
  const completeCount = steps.filter((item) => item.complete).length;
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    onChange({
      ...draft,
      [key]: value,
      activation: {
        ...draft.activation,
        reviewAccepted: false,
        verificationStatus: "draft",
      },
    });
  const updateActivation = (patch: Partial<Draft["activation"]>) =>
    onChange({
      ...draft,
      activation: {
        ...draft.activation,
        ...patch,
        ...("reviewAccepted" in patch ? {} : { reviewAccepted: false }),
        verificationStatus: "draft",
      },
    });
  const addFileNames = (
    key: "photoNames" | "documentNames" | "driverDocumentNames",
    files: FileList | null,
    limit: number,
  ) => {
    const names = files ? Array.from(files, (file) => file.name) : [];
    updateActivation({
      [key]: [...new Set([...draft.activation[key], ...names])].slice(0, limit),
    });
  };
  const nextStep = () => {
    const next = steps[Math.min(stepIndex + 1, steps.length - 1)];
    setActiveStep(next.id);
  };
  return (
    <form
      className="listing-readiness controlled-listing"
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <header className="readiness-header">
        <div>
          <span className="eyebrow">
            PROVIDER ACTIVATION · SAVED ON THIS DEVICE
          </span>
          <h3>{draft.name || "Prepare your listing"}</h3>
          <p>
            {completeCount} of {steps.length} stages ready · Nothing is
            published
          </p>
        </div>
        <span
          className="readiness-score"
          aria-label={`${completeCount} of ${steps.length} stages complete`}
        >
          {completeCount}/{steps.length}
        </span>
      </header>

      <nav className="readiness-rail" aria-label="Listing readiness stages">
        {steps.map((item, index) => (
          <button
            type="button"
            key={item.id}
            data-active={item.id === activeStep}
            data-complete={item.complete}
            aria-current={item.id === activeStep ? "step" : undefined}
            onClick={() => setActiveStep(item.id)}
          >
            <span>{item.complete ? "✓" : index + 1}</span>
            {item.shortLabel}
          </button>
        ))}
      </nav>

      <div className="readiness-task" key={step.id}>
        <header>
          <span>
            STEP {stepIndex + 1} OF {steps.length}
          </span>
          <h4>{step.title}</h4>
          <p>{step.description}</p>
        </header>

        {step.id === "provider" && (
          <div className="provider-stage-summary">
            {step.complete ? (
              <>
                <span className="readiness-state is-complete">
                  Provider details ready
                </span>
                <h5>{profile.name}</h5>
                <p>
                  {profile.area} ·{" "}
                  {profile.services.map(serviceLabel).join(" · ")}
                </p>
              </>
            ) : (
              <>
                <span className="readiness-state">Needs attention</span>
                <h5>Start with the person or business behind this listing.</h5>
                <p>Add a public name, service area and at least one service.</p>
              </>
            )}
            <button className="smallbtn" type="button" onClick={onOpenProfile}>
              {step.complete
                ? "Review provider details"
                : "Complete provider details"}{" "}
              →
            </button>
          </div>
        )}

        {step.id === "basics" && (
          <div className="readiness-fields">
            <FieldInput
              required
              maxLength={100}
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
              label="Listing name"
              hint="Use the name customers will recognise."
            />
            <FieldSelect
              aria-label="Vehicle category"
              value={draft.vehicleType}
              onChange={(e) => update("vehicleType", e.target.value)}
              label="Vehicle category"
              options={[...vehicleTypes.map((v) => ({ label: v, value: v }))]}
            />
            <div className="readiness-field-pair">
              <FieldInput
                maxLength={80}
                value={draft.activation.make}
                onChange={(e) => updateActivation({ make: e.target.value })}
                label="Make (optional)"
              />
              <FieldInput
                maxLength={80}
                value={draft.activation.model}
                onChange={(e) => updateActivation({ model: e.target.value })}
                label="Model (optional)"
              />
            </div>
            <div className="readiness-field-pair">
              <FieldInput
                type="number"
                min="1950"
                max="2100"
                value={draft.activation.year || ""}
                onChange={(e) =>
                  updateActivation({ year: Number(e.target.value) })
                }
                label="Year (optional)"
              />
              <FieldInput
                maxLength={50}
                value={draft.activation.colour}
                onChange={(e) => updateActivation({ colour: e.target.value })}
                label="Colour (optional)"
              />
            </div>
            <FieldInput
              required
              maxLength={100}
              value={draft.area}
              onChange={(e) => update("area", e.target.value)}
              label="Primary service area"
            />
            <div className="readiness-field-pair">
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
            </div>
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
                hint="You can set service-specific rates under Terms."
                prefix="R"
              />
            )}
            <fieldset className="service-checkboxes compact-services">
              <legend>Services offered</legend>
              {services.map((service) => (
                <label className="check-field" key={service.id}>
                  <input
                    type="checkbox"
                    checked={draft.services.includes(service.id)}
                    onChange={(e) =>
                      update(
                        "services",
                        e.target.checked
                          ? [...draft.services, service.id]
                          : draft.services.filter(
                              (value) => value !== service.id,
                            ),
                      )
                    }
                  />
                  {service.label}
                </label>
              ))}
            </fieldset>
            <FieldTextarea
              maxLength={1000}
              value={draft.notes}
              onChange={(e) => update("notes", e.target.value)}
              label="What should customers know? (optional)"
            />
          </div>
        )}

        {step.id === "photos" && (
          <div className="upload-stage">
            <label className="file-drop">
              <span>Choose vehicle photos</span>
              <small>JPG, PNG or HEIC · select up to 12</small>
              <input
                type="file"
                accept="image/jpeg,image/png,image/heic,image/heif"
                multiple
                onChange={(e) => addFileNames("photoNames", e.target.files, 12)}
              />
            </label>
            <div className="file-requirements" aria-label="Photo requirements">
              {[
                "Front exterior",
                "Rear exterior",
                "Interior",
                "Condition detail",
              ].map((label, index) => (
                <span
                  key={label}
                  data-complete={Boolean(draft.activation.photoNames[index])}
                >
                  {draft.activation.photoNames[index] ? "✓" : index + 1} {label}
                </span>
              ))}
            </div>
            {draft.activation.photoNames.length > 0 && (
              <ul className="selected-files">
                {draft.activation.photoNames.map((name) => (
                  <li key={name}>
                    <span>{name}</span>
                    <button
                      type="submit"
                      aria-label={`Remove ${name}`}
                      onClick={() =>
                        updateActivation({
                          photoNames: draft.activation.photoNames.filter(
                            (item) => item !== name,
                          ),
                        })
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="secure-note">
              Only filenames are noted in this prototype. Image contents are not
              uploaded or retained.
            </p>
          </div>
        )}

        {step.id === "verification" && (
          <div className="readiness-fields">
            <FieldSelect
              aria-label="Authority to list"
              value={draft.activation.ownership}
              onChange={(e) =>
                updateActivation({
                  ownership: e.target.value as Draft["activation"]["ownership"],
                })
              }
              label="Your authority to list this vehicle"
              options={[
                { label: "Choose one", value: "" },
                { label: "I own this vehicle", value: "owned" },
                { label: "I am authorised to operate it", value: "authorised" },
              ]}
            />
            <FieldInput
              maxLength={6}
              value={draft.activation.registrationLast6}
              onChange={(e) =>
                updateActivation({
                  registrationLast6: e.target.value
                    .replace(/[^a-z0-9]/gi, "")
                    .slice(-6)
                    .toUpperCase(),
                })
              }
              label="Registration or VIN — last 6 characters (optional)"
              hint="The full identifier belongs in a secure verification service, not chat."
            />
            <label className="file-drop is-compact">
              <span>Choose vehicle documents</span>
              <small>Registration plus ownership or operating authority</small>
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={(e) =>
                  addFileNames("documentNames", e.target.files, 8)
                }
              />
            </label>
            <div className="verification-checks">
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={draft.activation.insuranceConfirmed}
                  onChange={(e) =>
                    updateActivation({ insuranceConfirmed: e.target.checked })
                  }
                />
                The vehicle has appropriate current insurance
              </label>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={draft.activation.roadworthyConfirmed}
                  onChange={(e) =>
                    updateActivation({ roadworthyConfirmed: e.target.checked })
                  }
                />
                The vehicle is licensed and roadworthy
              </label>
            </div>
            {needsDriverDocuments(draft) && (
              <label className="file-drop is-compact">
                <span>Choose driver credentials</span>
                <small>Driver licence and professional driving permit</small>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={(e) =>
                    addFileNames("driverDocumentNames", e.target.files, 8)
                  }
                />
              </label>
            )}
            <div className="document-counts">
              <span>
                {draft.activation.documentNames.length}/2 vehicle documents
                prepared
              </span>
              {needsDriverDocuments(draft) && (
                <span>
                  {draft.activation.driverDocumentNames.length}/2 driver
                  documents prepared
                </span>
              )}
            </div>
            <p className="secure-note">
              Files are not uploaded in this local demo. A production build must
              use private storage, access controls and expiring review links.
            </p>
          </div>
        )}

        {step.id === "availability" && (
          <div className="readiness-fields">
            <FieldSelect
              aria-label="Availability method"
              value={draft.activation.availabilityMode}
              onChange={(e) =>
                updateActivation({
                  availabilityMode: e.target
                    .value as Draft["activation"]["availabilityMode"],
                })
              }
              label="How should availability work?"
              options={[
                { label: "Choose one", value: "" },
                { label: "Confirm each request", value: "on-request" },
                {
                  label: "Maintain an availability calendar",
                  value: "calendar",
                },
              ]}
            />
            <div className="readiness-field-pair">
              <FieldInput
                type="number"
                min="1"
                max="365"
                value={draft.activation.minimumDays}
                onChange={(e) =>
                  updateActivation({ minimumDays: Number(e.target.value) })
                }
                label="Minimum rental days"
              />
              <FieldInput
                type="number"
                min="0"
                max="8760"
                value={draft.activation.noticeHours}
                onChange={(e) =>
                  updateActivation({ noticeHours: Number(e.target.value) })
                }
                label="Minimum notice (hours)"
              />
            </div>
            <FieldTextarea
              required
              maxLength={500}
              value={draft.activation.pickupInstructions}
              onChange={(e) =>
                updateActivation({ pickupInstructions: e.target.value })
              }
              label="Pickup or handover plan"
              hint="Describe the area and process, not a private home address."
            />
            <FieldInput
              type="number"
              min="0"
              max="1000"
              value={draft.activation.deliveryRadiusKm}
              onChange={(e) =>
                updateActivation({ deliveryRadiusKm: Number(e.target.value) })
              }
              label="Optional delivery radius (km)"
            />
          </div>
        )}

        {step.id === "terms" && (
          <div className="readiness-fields">
            {draft.services.length > 1 && draft.rateUnit !== "quote" && (
              <div className="service-rate-list">
                <h5>Service-specific starting rates</h5>
                <p>
                  Different services can use different pricing. Final quotes
                  still require confirmation.
                </p>
                {draft.services.map((service) => (
                  <FieldInput
                    key={service}
                    type="number"
                    min="1"
                    max="10000000"
                    value={draft.activation.serviceRates[service] || ""}
                    onChange={(e) =>
                      updateActivation({
                        serviceRates: {
                          ...draft.activation.serviceRates,
                          [service]: Number(e.target.value),
                        },
                      })
                    }
                    label={`${serviceLabel(service)} starting rate`}
                    prefix="R"
                  />
                ))}
              </div>
            )}
            <div className="readiness-field-pair">
              <FieldInput
                type="number"
                min="0"
                max="10000000"
                value={draft.activation.securityDeposit}
                onChange={(e) =>
                  updateActivation({ securityDeposit: Number(e.target.value) })
                }
                label="Refundable security deposit"
                hint="Use 0 only when no deposit applies."
                prefix="R"
              />
              <FieldInput
                type="number"
                min="0"
                max="10000"
                value={draft.activation.mileagePerDay}
                onChange={(e) =>
                  updateActivation({ mileagePerDay: Number(e.target.value) })
                }
                label="Included mileage per day (km)"
              />
            </div>
            <FieldSelect
              aria-label="Fuel policy"
              value={draft.activation.fuelPolicy}
              onChange={(e) =>
                updateActivation({
                  fuelPolicy: e.target
                    .value as Draft["activation"]["fuelPolicy"],
                })
              }
              label="Fuel policy"
              options={[
                { label: "Choose one", value: "" },
                { label: "Return at the same level", value: "same-to-same" },
                { label: "Full tank to full tank", value: "full-to-full" },
                { label: "Fuel included in service", value: "included" },
              ]}
            />
            <FieldSelect
              aria-label="Cancellation policy"
              value={draft.activation.cancellationPolicy}
              onChange={(e) =>
                updateActivation({
                  cancellationPolicy: e.target
                    .value as Draft["activation"]["cancellationPolicy"],
                })
              }
              label="Cancellation approach"
              options={[
                { label: "Choose one", value: "" },
                {
                  label: "Flexible — full refund until 24 hours before",
                  value: "flexible",
                },
                {
                  label: "Moderate — full refund until 3 days before",
                  value: "moderate",
                },
                {
                  label: "Strict — full refund until 7 days before",
                  value: "strict",
                },
              ]}
            />
            <p className="secure-note">
              These are draft policies. Production terms must show fees,
              exclusions, release timing and damage handling before a customer
              pays.
            </p>
          </div>
        )}

        {step.id === "review" && (
          <div className="review-stage">
            <div className="review-checklist">
              {steps.slice(0, -1).map((item) => (
                <button
                  type="submit"
                  key={item.id}
                  onClick={() => setActiveStep(item.id)}
                >
                  <span data-complete={item.complete}>
                    {item.complete ? "✓" : "!"}
                  </span>
                  <span>
                    <b>{item.shortLabel}</b>
                    <small>
                      {item.complete ? "Prepared" : "Needs attention"}
                    </small>
                  </span>
                  <span>Review →</span>
                </button>
              ))}
            </div>
            <aside className="integration-gate">
              <span className="eyebrow">REQUIRED BEFORE PUBLICATION</span>
              <h5>Two secure handoffs remain</h5>
              <p>
                <b>Verification:</b> private document upload and reviewer
                approval.
              </p>
              <p>
                <b>Payouts:</b> a Paystack-hosted beneficiary and settlement
                setup.
              </p>
              <small>
                GOMONO does not collect bank credentials inside chat.
              </small>
            </aside>
            <label className="review-confirmation check-field">
              <input
                type="checkbox"
                checked={draft.activation.reviewAccepted}
                disabled={!steps.slice(0, -1).every((item) => item.complete)}
                onChange={(e) =>
                  updateActivation({ reviewAccepted: e.target.checked })
                }
              />
              I confirm these prepared details are accurate and ready for a
              secure verification handoff.
            </label>
          </div>
        )}
      </div>

      <footer className="readiness-actions">
        <button type="button" onClick={onCancel}>
          Finish later
        </button>
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={() => setActiveStep(steps[stepIndex - 1].id)}
          >
            Back
          </button>
        )}
        {stepIndex < steps.length - 1 ? (
          <button type="button" className="smallbtn" onClick={nextStep}>
            {step.complete ? "Continue" : "Continue for now"} →
          </button>
        ) : (
          <button
            type="submit"
            className="smallbtn"
            disabled={!steps.at(-1)?.complete}
          >
            Save verification-ready draft
          </button>
        )}
        {step.id !== "review" && (
          <button type="submit" className="text-button">
            Save listing draft
          </button>
        )}
      </footer>
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
  profile,
  onEdit,
  onPreview,
  onAdd,
}: {
  drafts: Draft[];
  profile: ProviderProfile;
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
        drafts.map((d) => {
          const steps = providerReadiness(d, profile);
          const complete = steps.filter((step) => step.complete).length;
          const next = steps.find((step) => !step.complete);
          return (
            <article className="draft-card readiness-draft-card" key={d.id}>
              <div className="draft-content">
                <span className="eyebrow">
                  {d.activation.verificationStatus === "ready"
                    ? "PREPARED FOR VERIFICATION"
                    : d.status === "preview"
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
                <div className="fleet-readiness-summary">
                  <span>
                    <b>
                      {complete}/{steps.length}
                    </b>{" "}
                    stages ready
                  </span>
                  <div
                    aria-label={`${complete} of ${steps.length} readiness stages complete`}
                  >
                    <i
                      style={{ width: `${(complete / steps.length) * 100}%` }}
                    />
                  </div>
                  <p>
                    {next
                      ? `Next: ${next.title}`
                      : "Prepared for secure verification handoff"}
                  </p>
                </div>
                <details className="decision-help">
                  <summary>Readiness details</summary>
                  <ul className="fleet-readiness-list">
                    {steps.map((step) => (
                      <li key={step.id} data-complete={step.complete}>
                        <span>{step.complete ? "✓" : "·"}</span>
                        {step.shortLabel}
                        <small>{step.complete ? "Ready" : "Incomplete"}</small>
                      </li>
                    ))}
                  </ul>
                </details>
                <b>
                  {d.rateUnit === "quote"
                    ? "Quote on request"
                    : `${money(d.price)} / ${d.rateUnit}`}
                </b>
                <div className="inline-actions">
                  <button className="smallbtn" onClick={() => onEdit(d.id)}>
                    {next ? "Edit listing" : "Review prepared listing"}
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
          );
        })
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
