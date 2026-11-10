import { useEffect, useState } from "react";
import { loadDrafts, saveDemo, money, type Draft } from "../demo/marketplace";
import { loadProfile, serviceLabel } from "../demo/services";
import { type ProviderView, type Navigate } from "./navigation";
import { OwnerWorkspace } from "./OwnerWorkspace";
import { ProviderProfile, providerKindLabel } from "./ProviderProfile";
export function ProviderWorkspace({
  view,
  navigate,
}: {
  view: ProviderView;
  navigate: Navigate;
}) {
  const [drafts, setDrafts] = useState(loadDrafts);
  const [profile, setProfile] = useState(loadProfile);
  useEffect(() => saveDemo("mono-listings", drafts), [drafts]);
  useEffect(() => saveDemo("mono-provider-profile-v1", profile), [profile]);
  function saveDraft(draft: Draft) {
    setDrafts((all) =>
      all.some((d) => d.id === draft.id)
        ? all.map((d) => (d.id === draft.id ? draft : d))
        : [...all, draft],
    );
  }
  if (view === "provider-profile")
    return <ProviderProfile profile={profile} onSave={setProfile} />;
  if (view === "owner")
    return (
      <OwnerWorkspace
        drafts={drafts}
        onSave={saveDraft}
        onStore={() => navigate("store")}
        defaultServices={profile.services}
      />
    );
  if (view === "provider-requests")
    return (
      <>
        <div className="eyebrow">PROVIDER STUDIO / INCOMING REQUESTS</div>
        <h2 className="page-title">Your business inbox.</h2>
        <p className="muted">
          Only requests addressed to your vehicles or services will appear here.
        </p>
        <div className="empty-state">
          <span className="empty-icon">▤</span>
          <h3>No live requests yet.</h3>
          <p>
            Customer demo requests are kept in the customer workspace. They are
            not delivered to providers, and do not appear in this inbox.
          </p>
          <button className="smallbtn" onClick={() => navigate("owner")}>
            Prepare vehicles & services →
          </button>
        </div>
        <div className="scope-card">
          <h3>When live requests are connected</h3>
          <p>
            Review the service brief, confirm availability, send the correct
            quote and respond from this dedicated provider inbox. Live delivery
            and notifications are not enabled yet.
          </p>
        </div>
      </>
    );
  if (view === "store")
    return (
      <>
        <div className="eyebrow">PROVIDER STUDIO / LOCAL PREVIEW</div>
        <h2 className="page-title">A storefront of your own.</h2>
        <p className="muted">
          Your provider showroom preview. Nothing on this page is publicly
          published.
        </p>
        <div className="storefront-hero">
          <span className="eyebrow">
            MONO / {providerKindLabel(profile.kind)}
          </span>
          <h2>{profile.name || "Your rental & transport collection"}</h2>
          <p>
            {profile.area} · {profile.services.map(serviceLabel).join(" · ")}
          </p>
          {profile.description && <p>{profile.description}</p>}
        </div>
        {drafts.some((d) => d.status === "preview") ? (
          <div className="store-list">
            {drafts
              .filter((d) => d.status === "preview")
              .map((d) => (
                <article className="store-item" key={d.id}>
                  <span className="store-monogram">{d.name.slice(0, 1)}</span>
                  <div>
                    <h3>{d.name}</h3>
                    <p>
                      {d.area} · {d.vehicleType} · {d.seats} seats
                    </p>
                    <p>{d.services.map(serviceLabel).join(" · ")}</p>
                    {d.notes && <p className="muted">{d.notes}</p>}
                  </div>
                  <strong>
                    {d.rateUnit === "quote"
                      ? "Quote on request"
                      : `${money(d.price)} / ${d.rateUnit}`}
                  </strong>
                </article>
              ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Your collection starts with a draft.</h2>
            <p>
              Save a vehicle or service and select “Add to preview” to see it
              here.
            </p>
            <button className="smallbtn" onClick={() => navigate("owner")}>
              Manage vehicles & services →
            </button>
          </div>
        )}
        <p className="notice">
          Preview listings do not enter customer inventory. Availability,
          verification and public publishing are not enabled.
        </p>
      </>
    );
  return (
    <>
      <div className="eyebrow">PROVIDER STUDIO / OVERVIEW</div>
      <div className="dashboard-welcome">
        <div>
          <h2>
            {profile.name
              ? `Welcome back, ${profile.name}.`
              : "Your business. In the driver’s seat."}
          </h2>
          <p>
            A dedicated workspace for private owners, fleets and transport
            operators.
          </p>
        </div>
        <span className="provider-type-badge">
          {providerKindLabel(profile.kind)}
        </span>
      </div>
      <div className="statgrid">
        <div className="stat">
          <span>Vehicle & service drafts</span>
          <b>{drafts.length}</b>
        </div>
        <div className="stat">
          <span>In local storefront preview</span>
          <b>{drafts.filter((d) => d.status === "preview").length}</b>
        </div>
        <div className="stat">
          <span>Live incoming requests</span>
          <b>0</b>
        </div>
      </div>
      <div className="provider-action-grid">
        <button
          className="provider-primary-action"
          onClick={() => navigate(profile.name ? "owner" : "provider-profile")}
        >
          <span className="eyebrow">YOUR NEXT STEP</span>
          <h3>
            {profile.name
              ? "Build your service collection."
              : "Start with your provider profile."}
          </h3>
          <p>
            {profile.name
              ? "Add a vehicle, choose the services it supports and set a suitable rate basis."
              : "Tell us whether you are a private owner, fleet business or transport operator, and what you offer."}
          </p>
          <b>
            {profile.name
              ? "Manage vehicles & services"
              : "Set up provider profile"}{" "}
            →
          </b>
        </button>
        <section className="scope-card">
          <span className="eyebrow">YOUR OFFERING</span>
          <h3>{profile.name || "Your future storefront"}</h3>
          <div className="service-badges">
            {profile.services.map((s) => (
              <span key={s}>{serviceLabel(s)}</span>
            ))}
          </div>
          <button
            className="text-button"
            onClick={() => navigate("provider-profile")}
          >
            Edit provider profile →
          </button>
        </section>
      </div>
      <section className="provider-checklist">
        <div className="section-heading">
          <h3>Your setup checklist</h3>
          <span className="status-badge">Local demo</span>
        </div>
        <button onClick={() => navigate("provider-profile")}>
          <span className={profile.name ? "step-done" : ""}>
            {profile.name ? "✓" : "01"}
          </span>
          <div>
            <b>Define your provider profile</b>
            <small>Provider type, service area and services offered</small>
          </div>
          <strong>{profile.name ? "Saved" : "Start"} →</strong>
        </button>
        <button onClick={() => navigate("owner")}>
          <span className={drafts.length ? "step-done" : ""}>
            {drafts.length ? "✓" : "02"}
          </span>
          <div>
            <b>Add vehicles & service drafts</b>
            <small>Vehicle category, service types and pricing basis</small>
          </div>
          <strong>{drafts.length ? "Manage" : "Add"} →</strong>
        </button>
        <button onClick={() => navigate("store")}>
          <span>03</span>
          <div>
            <b>Review your local storefront</b>
            <small>A preview for your business, not a published listing</small>
          </div>
          <strong>Preview →</strong>
        </button>
        <div className="locked-step">
          <span>04</span>
          <div>
            <b>Verify, publish & receive requests</b>
            <small>
              Live provider verification, availability and notifications are not
              connected yet.
            </small>
          </div>
          <strong>Upcoming</strong>
        </div>
      </section>
    </>
  );
}
