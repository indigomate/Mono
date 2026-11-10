import { FieldSelect } from "../components/ui/FieldSelect";
import { FieldInput } from "../components/ui/FieldInput";
import { useState } from "react";
import { type Trip, today } from "../demo/marketplace";
import { vehicleTypes } from "../demo/services";
export function TripEditor({
  trip,
  onSave,
  onCancel,
}: {
  trip: Trip;
  onSave: (trip: Trip) => void;
  onCancel: () => void;
}) {
  const [error, setError] = useState("");
  return (
    <form
      className="trip-editor"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const next = {
          ...trip,
          location: String(f.get("location")).trim(),
          start: String(f.get("start")),
          end: String(f.get("end")),
          days: Number(f.get("days")),
          budget: Number(f.get("budget")),
          budgetMode: f.get("budgetMode") as Trip["budgetMode"],
          category: String(f.get("category")),
          make: String(f.get("make")),
          tier: String(f.get("tier")),
          transmission: String(f.get("transmission")),
          passengers: Number(f.get("passengers")),
        };
        if (
          (next.start && !next.end) ||
          (!next.start && next.end) ||
          (next.start && next.end <= next.start)
        ) {
          setError(
            "Choose a return date after pickup, or leave both dates blank.",
          );
          return;
        }
        onSave(next);
      }}
    >
      <div className="section-heading">
        <h2>Edit your trip</h2>
        <button type="button" className="text-button" onClick={onCancel}>
          Close
        </button>
      </div>
      <div className="fields-grid">
        <FieldInput
          name="location"
          defaultValue={trip.location}
          required
          maxLength={80}
          label="Pickup city"
        />
        <FieldSelect
          name="category"
          defaultValue={trip.category}
          label="Vehicle type"
          options={[
            { label: "Any type", value: "" },
            ...vehicleTypes.map((type) => ({ label: type, value: type })),
          ]}
        />
        <FieldSelect
          name="make"
          defaultValue={trip.make}
          label="Make"
          options={[
            { label: "Any make", value: "" },
            { label: "Audi", value: "Audi" },
            { label: "BMW", value: "BMW" },
            { label: "Toyota", value: "Toyota" },
            { label: "Range Rover", value: "Range Rover" },
          ]}
        />
        <FieldSelect
          name="tier"
          defaultValue={trip.tier}
          label="Vehicle class"
          options={[
            { label: "Any class", value: "" },
            { label: "Economy", value: "Economy" },
            { label: "Premium", value: "Premium" },
          ]}
        />
        <FieldInput
          name="start"
          type="date"
          min={today()}
          defaultValue={trip.start}
          label="Pickup date"
        />
        <FieldInput
          name="end"
          type="date"
          min={trip.start || today()}
          defaultValue={trip.end}
          label="Return date"
        />
        <FieldInput
          type="number"
          name="days"
          min="0"
          max="365"
          defaultValue={trip.days}
          label="Rental days if dates unknown"
        />
        <FieldInput
          type="number"
          name="budget"
          min="0"
          max="10000000"
          defaultValue={trip.budget}
          label="Budget (ZAR)"
          hint="Base rental only; fees and deposit are not quoted."
          prefix="R"
        />
        <FieldSelect
          name="budgetMode"
          defaultValue={trip.budgetMode}
          label="Budget applies to"
          options={[
            { label: "Per day", value: "daily" },
            { label: "Whole rental", value: "total" },
          ]}
        />
        <FieldSelect
          name="transmission"
          defaultValue={trip.transmission}
          label="Transmission"
          options={[
            { label: "Any transmission", value: "" },
            { label: "Automatic", value: "Automatic" },
            { label: "Manual", value: "Manual" },
          ]}
        />
        <FieldInput
          type="number"
          name="passengers"
          min="0"
          max="20"
          defaultValue={trip.passengers}
          label="Passengers"
        />
      </div>
      <p className="muted">
        Cape Town demo only. Budget filtering covers base rental; fees and
        deposits are not yet quoted.
      </p>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <button className="smallbtn">Update trip</button>
    </form>
  );
}
