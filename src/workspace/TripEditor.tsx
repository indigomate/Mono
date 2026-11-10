import { useState } from "react";
import { type Trip, today } from "../demo/marketplace";
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
        <label>
          Pickup city
          <input
            name="location"
            defaultValue={trip.location}
            required
            maxLength={80}
          />
        </label>
        <label>
          Vehicle type
          <select name="category" defaultValue={trip.category}>
            <option value="">Any type</option>
            <option>SUV</option>
            <option>Sedan</option>
          </select>
        </label>
        <label>
          Make
          <select name="make" defaultValue={trip.make}>
            <option value="">Any make</option>
            <option>Audi</option>
            <option>BMW</option>
            <option>Toyota</option>
            <option>Range Rover</option>
          </select>
        </label>
        <label>
          Vehicle class
          <select name="tier" defaultValue={trip.tier}>
            <option value="">Any class</option>
            <option>Economy</option>
            <option>Premium</option>
          </select>
        </label>
        <label>
          Pickup date
          <input
            name="start"
            type="date"
            min={today()}
            defaultValue={trip.start}
          />
        </label>
        <label>
          Return date
          <input
            name="end"
            type="date"
            min={trip.start || today()}
            defaultValue={trip.end}
          />
        </label>
        <label>
          Rental days if dates unknown
          <input
            type="number"
            name="days"
            min="0"
            max="365"
            defaultValue={trip.days}
          />
        </label>
        <label>
          Budget (ZAR)
          <input
            type="number"
            name="budget"
            min="0"
            max="10000000"
            defaultValue={trip.budget}
          />
        </label>
        <label>
          Budget applies to
          <select name="budgetMode" defaultValue={trip.budgetMode}>
            <option value="daily">Per day</option>
            <option value="total">Whole rental</option>
          </select>
        </label>
        <label>
          Transmission
          <select name="transmission" defaultValue={trip.transmission}>
            <option value="">Any transmission</option>
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </label>
        <label>
          Passengers
          <input
            type="number"
            name="passengers"
            min="0"
            max="20"
            defaultValue={trip.passengers}
          />
        </label>
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
