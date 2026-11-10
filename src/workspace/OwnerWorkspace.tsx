import { useState } from "react";
import { type Draft, money } from "../demo/marketplace";
import { VehicleServiceEditor } from "./VehicleServiceEditor";
import { serviceLabel, type ServiceType } from "../demo/services";
export function OwnerWorkspace({
  drafts,
  onSave,
  onStore,
  defaultServices,
}: {
  drafts: Draft[];
  onSave: (draft: Draft) => void;
  onStore: () => void;
  defaultServices: ServiceType[];
}) {
  const [editing, setEditing] = useState<Draft | null>(null);
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState("");
  function openNew() {
    setEditing(null);
    setAdding(true);
    setNotice("");
  }
  return (
    <>
      <div className="eyebrow">PROVIDER STUDIO / VEHICLES & SERVICES</div>
      <div className="section-heading">
        <div>
          <h1>Your vehicles & services.</h1>
          <p className="muted">
            Manage private rentals, fleet vehicles and driver-led services in
            your provider workspace.
          </p>
        </div>
        <button className="smallbtn" onClick={openNew}>
          + Add a listing
        </button>
      </div>
      <div className="statgrid">
        <div className="stat">
          <span>Saved listings</span>
          <b>{drafts.length}</b>
        </div>
        <div className="stat">
          <span>Ready for local preview</span>
          <b>{drafts.filter((d) => d.status === "preview").length}</b>
        </div>
        <div className="stat">
          <span>Live listings</span>
          <b>0</b>
        </div>
      </div>
      <div className="owner-callout">
        <span className="step-number">01</span>
        <div>
          <strong>Your next milestone: a complete listing draft</strong>
          <p>
            Choose the vehicle and services, review your storefront, then
            prepare photos, availability and verification for the live launch.
          </p>
        </div>
      </div>
      {notice && (
        <p role="status" className="success-note">
          {notice}
        </p>
      )}
      {(adding || editing) && (
        <VehicleServiceEditor
          key={editing?.id || "new"}
          draft={editing}
          defaultServices={defaultServices}
          onCancel={() => {
            setAdding(false);
            setEditing(null);
          }}
          onSave={(draft) => {
            onSave(draft);
            setAdding(false);
            setEditing(null);
            setNotice(
              "Listing draft saved in Provider Studio. Preview it below; it has not been published.",
            );
          }}
        />
      )}
      <div className="section-heading">
        <h2>Your listings</h2>
        <button className="text-button" onClick={onStore}>
          Preview storefront →
        </button>
      </div>
      {!drafts.length ? (
        <div className="empty-state">
          <span className="empty-icon">◇</span>
          <h2>Your first listing starts here.</h2>
          <p>
            Save a listing or transport service draft. Progress stays on this
            device.
          </p>
          <button className="smallbtn" onClick={openNew}>
            Create first listing
          </button>
        </div>
      ) : (
        <div className="draft-grid">
          {drafts.map((d) => (
            <article className="draft-card" key={d.id}>
              <div className="draft-cover">
                <span>GOMONO / COLLECTION</span>
                <b>{d.name.split(" ")[0]}</b>
                <span>
                  {d.status === "preview" ? "LOCAL PREVIEW" : "DRAFT"}
                </span>
              </div>
              <div className="draft-content">
                <h3>{d.name}</h3>
                <p className="muted">
                  {d.area} · {d.vehicleType} · {d.seats} seats
                </p>
                <div className="service-badges">
                  {d.services.map((service) => (
                    <span key={service}>{serviceLabel(service)}</span>
                  ))}
                </div>
                <strong>
                  {d.rateUnit === "quote"
                    ? "Quote on request"
                    : `${money(d.price)} / ${d.rateUnit}`}
                </strong>
                <p className="completion-note">
                  Next: photos, availability & verification
                </p>
                <div className="card-actions">
                  <button
                    className="smallbtn"
                    onClick={() => {
                      setEditing(d);
                      setAdding(false);
                      setNotice("");
                    }}
                  >
                    Edit listing
                  </button>
                  <button
                    className="text-button"
                    onClick={() => {
                      onSave({
                        ...d,
                        status: d.status === "preview" ? "draft" : "preview",
                      });
                      setNotice(
                        d.status === "preview"
                          ? "Removed from local storefront preview."
                          : "Added to local storefront preview. This does not publish it.",
                      );
                    }}
                  >
                    {d.status === "preview"
                      ? "Remove from preview"
                      : "Add to preview"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <div className="owner-roadmap">
        <h2>From draft to first handover</h2>
        <div className="milestone">
          <b>1. Create your draft</b>
          <span>Available now · saved on this device</span>
        </div>
        <div className="milestone">
          <b>2. Verify & set availability</b>
          <span>Coming with live owner onboarding</span>
        </div>
        <div className="milestone">
          <b>3. Respond to requests</b>
          <span>Coming with live booking services</span>
        </div>
      </div>
    </>
  );
}
