import { FieldSelect } from "../components/ui/FieldSelect";
import { FieldTextarea } from "../components/ui/FieldTextarea";
import { FieldInput } from "../components/ui/FieldInput";
import { useState } from "react";
import { emptyListingActivation, type Draft } from "../demo/marketplace";
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
          activation: draft?.activation || emptyListingActivation(),
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
        <FieldInput
          name="name"
          required
          maxLength={100}
          defaultValue={draft?.name}
          placeholder="e.g. Mercedes C-Class or executive transfers"
          label="Listing name"
        />
        <FieldSelect
          aria-label="Vehicle category"
          name="vehicleType"
          defaultValue={draft?.vehicleType || "Sedan"}
          label="Vehicle category"
          options={[...vehicleTypes.map((v) => ({ label: v, value: v }))]}
        />
        <FieldInput
          name="area"
          required
          maxLength={100}
          defaultValue={draft?.area}
          placeholder="e.g. Cape Town / Waterfront"
          label="Service area"
        />
        <FieldInput
          name="seats"
          type="number"
          min="1"
          max="100"
          required
          defaultValue={draft?.seats || 5}
          label="Seats / passenger capacity"
        />
        <FieldSelect
          aria-label="Transmission"
          name="transmission"
          defaultValue={draft?.transmission || "Automatic"}
          label="Transmission"
          options={[
            { label: "Automatic", value: "Automatic" },
            { label: "Manual", value: "Manual" },
            { label: "Not applicable", value: "Not applicable" },
          ]}
        />
        <FieldSelect
          aria-label="Pricing basis"
          value={rateUnit}
          onChange={(e) => setRateUnit(e.target.value as Draft["rateUnit"])}
          label="Pricing basis"
          options={[
            { label: "Per day", value: "day" },
            { label: "Per hour", value: "hour" },
            { label: "Per trip / transfer", value: "trip" },
            { label: "Per month", value: "month" },
            { label: "Custom quote only", value: "quote" },
          ]}
        />
        {rateUnit !== "quote" && (
          <FieldInput
            name="price"
            type="number"
            required
            min="1"
            max="10000000"
            step="1"
            defaultValue={draft?.price || undefined}
            placeholder="1200"
            label="Reference rate (ZAR)"
            prefix="R"
          />
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
      <FieldTextarea
        name="notes"
        maxLength={1000}
        defaultValue={draft?.notes}
        placeholder="Driver arrangements, service limits, luggage, pickup instructions…"
        label="Vehicle & service notes"
      />
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
