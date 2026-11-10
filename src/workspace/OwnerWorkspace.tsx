import { useState } from "react";
import { type Draft, money } from "../demo/marketplace";
export function OwnerWorkspace({
  drafts,
  onSave,
  onStore,
}: {
  drafts: Draft[];
  onSave: (draft: Draft) => void;
  onStore: () => void;
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
      <div className="eyebrow">OWNER WORKSPACE / OVERVIEW</div>
      <div className="section-heading">
        <div>
          <h1>Your fleet. One place.</h1>
          <p className="muted">
            Build your collection, one great listing at a time.
          </p>
        </div>
        <button className="smallbtn" onClick={openNew}>
          + Add a vehicle
        </button>
      </div>
      <div className="statgrid">
        <div className="stat">
          <span>Saved vehicles</span>
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
          <strong>Your next milestone: a complete vehicle draft</strong>
          <p>
            Add vehicle details, review your storefront, then prepare photos,
            availability and verification for the live launch.
          </p>
        </div>
      </div>
      {notice && (
        <p role="status" className="success-note">
          {notice}
        </p>
      )}
      {(adding || editing) && (
        <form
          key={editing?.id || "new"}
          className="listing-editor"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const name = String(f.get("name")).trim(),
              area = String(f.get("area")).trim();
            if (!name || !area) return;
            onSave({
              id: editing?.id || crypto.randomUUID(),
              name,
              area,
              price: Number(f.get("price")),
              seats: Number(f.get("seats")),
              transmission: String(f.get("transmission")),
              notes: String(f.get("notes")).trim(),
              status: editing?.status || "draft",
            });
            setAdding(false);
            setEditing(null);
            setNotice(
              "Vehicle draft saved on this device. Review it below or preview your storefront.",
            );
          }}
        >
          <div className="section-heading">
            <h2>{editing ? "Edit vehicle" : "Create your vehicle draft"}</h2>
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setAdding(false);
                setEditing(null);
              }}
            >
              Cancel
            </button>
          </div>
          <div className="fields-grid">
            <label>
              Vehicle name
              <input
                name="name"
                required
                maxLength={100}
                defaultValue={editing?.name}
                placeholder="e.g. Mercedes-Benz C-Class"
              />
            </label>
            <label>
              Price per day (ZAR)
              <input
                name="price"
                type="number"
                required
                min="1"
                max="1000000"
                step="1"
                defaultValue={editing?.price}
                placeholder="1200"
              />
            </label>
            <label>
              Pickup area
              <input
                name="area"
                required
                maxLength={100}
                defaultValue={editing?.area}
                placeholder="e.g. Waterfront"
              />
            </label>
            <label>
              Transmission
              <select
                name="transmission"
                defaultValue={editing?.transmission || "Automatic"}
              >
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </label>
            <label>
              Seats
              <input
                name="seats"
                type="number"
                min="1"
                max="20"
                required
                defaultValue={editing?.seats || 5}
              />
            </label>
          </div>
          <label>
            Pickup and vehicle notes
            <textarea
              name="notes"
              maxLength={1000}
              defaultValue={editing?.notes}
              placeholder="What should a renter know about your vehicle?"
            />
          </label>
          <p className="muted">
            Draft only. Photos, calendar availability, document verification and
            public publishing are not connected yet.
          </p>
          <button className="smallbtn">Save vehicle draft</button>
        </form>
      )}
      <div className="section-heading">
        <h2>Your vehicles</h2>
        <button className="text-button" onClick={onStore}>
          Preview storefront →
        </button>
      </div>
      {!drafts.length ? (
        <div className="empty-state">
          <span className="empty-icon">◇</span>
          <h2>Your first listing starts here.</h2>
          <p>Save a draft now. Your progress stays on this device.</p>
          <button className="smallbtn" onClick={openNew}>
            Create first draft
          </button>
        </div>
      ) : (
        <div className="draft-grid">
          {drafts.map((d) => (
            <article className="draft-card" key={d.id}>
              <div className="draft-cover">
                <span>MONO / COLLECTION</span>
                <b>{d.name.split(" ")[0]}</b>
                <span>
                  {d.status === "preview" ? "LOCAL PREVIEW" : "DRAFT"}
                </span>
              </div>
              <div className="draft-content">
                <h3>{d.name}</h3>
                <p className="muted">
                  {d.area} · {d.transmission} · {d.seats} seats
                </p>
                <strong>{money(d.price)} / day</strong>
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
                    Edit vehicle
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
