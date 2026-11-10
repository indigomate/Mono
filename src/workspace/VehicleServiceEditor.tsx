import { useState } from "react";
import { type Draft } from "../demo/marketplace";
import { services, vehicleTypes, type ServiceType } from "../demo/services";
export function VehicleServiceEditor({
  draft,
  defaultServices,
  onSave,
  onCancel,
}: {
  draft: Draft | null;
  defaultServices: ServiceType[];
  onSave: (draft: Draft) => void;
  onCancel: () => void;
}) {
  const [rateUnit, setRateUnit] = useState<Draft["rateUnit"]>(
    draft?.rateUnit ||
      services.find((s) => s.id === defaultServices[0])?.unit ||
      "day",
  );
  const [error, setError] = useState("");
  return (
    <form
      className="listing-editor"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const name = String(f.get("name")).trim(),
          area = String(f.get("area")).trim(),
          selected = f.getAll("services") as ServiceType[];
        if (!name || !area || !selected.length) {
          setError(
            "Add a listing name, service area and at least one offered service.",
          );
          return;
        }
        onSave({
          id: draft?.id || crypto.randomUUID(),
          name,
          area,
          price: rateUnit === "quote" ? 0 : Number(f.get("price")),
          seats: Number(f.get("seats")),
          transmission: String(f.get("transmission")),
          notes: String(f.get("notes")).trim(),
          status: draft?.status || "draft",
          vehicleType: String(f.get("vehicleType")),
          services: selected,
          rateUnit,
        });
      }}
    >
      <div className="section-heading">
        <h2>{draft ? "Edit listing" : "Create a vehicle or service draft"}</h2>
        <button type="button" className="text-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <div className="fields-grid">
        <label>
          Listing name
          <input
            name="name"
            required
            maxLength={100}
            defaultValue={draft?.name}
            placeholder="e.g. Mercedes C-Class or executive transfers"
          />
        </label>
        <label>
          Vehicle category
          <select
            aria-label="Vehicle category"
            name="vehicleType"
            defaultValue={draft?.vehicleType || "Sedan"}
          >
            {vehicleTypes.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Service area
          <input
            name="area"
            required
            maxLength={100}
            defaultValue={draft?.area}
            placeholder="e.g. Cape Town / Waterfront"
          />
        </label>
        <label>
          Seats / passenger capacity
          <input
            name="seats"
            type="number"
            min="1"
            max="100"
            required
            defaultValue={draft?.seats || 5}
          />
        </label>
        <label>
          Transmission
          <select
            aria-label="Transmission"
            name="transmission"
            defaultValue={draft?.transmission || "Automatic"}
          >
            <option>Automatic</option>
            <option>Manual</option>
            <option>Not applicable</option>
          </select>
        </label>
        <label>
          Pricing basis
          <select
            aria-label="Pricing basis"
            value={rateUnit}
            onChange={(e) => setRateUnit(e.target.value as Draft["rateUnit"])}
          >
            <option value="day">Per day</option>
            <option value="hour">Per hour</option>
            <option value="trip">Per trip / transfer</option>
            <option value="month">Per month</option>
            <option value="quote">Custom quote only</option>
          </select>
        </label>
        {rateUnit !== "quote" && (
          <label>
            Reference rate (ZAR)
            <input
              name="price"
              type="number"
              required
              min="1"
              max="10000000"
              step="1"
              defaultValue={draft?.price || undefined}
              placeholder="1200"
            />
          </label>
        )}
      </div>
      <fieldset className="service-checkboxes">
        <legend>Services this listing supports</legend>
        {services.map((s) => (
          <label className="check-field" key={s.id}>
            <input
              type="checkbox"
              name="services"
              value={s.id}
              defaultChecked={(draft?.services || defaultServices).includes(
                s.id,
              )}
            />
            {s.label}
          </label>
        ))}
      </fieldset>
      <label>
        Vehicle & service notes
        <textarea
          name="notes"
          maxLength={1000}
          defaultValue={draft?.notes}
          placeholder="Driver arrangements, service limits, luggage, pickup instructions…"
        />
      </label>
      <p className="notice">
        A reference rate is not a binding quote for every service. Driver
        credentials, photos, availability and verification must be confirmed
        before live publishing.
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="smallbtn">Save listing draft</button>
    </form>
  );
}
