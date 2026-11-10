import { inventory, type Trip, money, duration } from "../demo/marketplace";
export function VehicleCards({
  ids,
  trip,
  onSelect,
}: {
  ids: number[];
  trip: Trip;
  onSelect: (id: number) => void;
}) {
  const cars = inventory.filter((c) => ids.includes(c.id));
  const days = duration(trip);
  return cars.length ? (
    <div className="chat-vehicle-grid">
      {cars.map((c) => (
        <article className="match-card" key={c.id}>
          <div className="match-image">
            <img src={c.img} alt={`Illustrative ${c.type}`} loading="lazy" />
            <span>{c.type}</span>
            <small className="photo-note">Illustrative image</small>
          </div>
          <div className="match-content">
            <h3>{c.name}</h3>
            <p className="spec-line">
              {c.area} · {c.transmission} · {c.seats} seats
            </p>
            <div className="match-price">
              <div>
                <b>{money(days ? c.price * days : c.price)}</b>
                <small>
                  {days
                    ? `base rental / ${days} days`
                    : "per day · dates required for total"}
                </small>
              </div>
              <button className="smallbtn" onClick={() => onSelect(c.id)}>
                View car
              </button>
            </div>
            <p className="availability-note">
              Availability unverified · Fees not yet quoted
            </p>
          </div>
        </article>
      ))}
    </div>
  ) : (
    <p>
      No sample vehicles meet this brief. Change a preference or ask for a
      custom enquiry.
    </p>
  );
}
