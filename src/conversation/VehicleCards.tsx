import { useRef } from "react";
import { EmptyState } from "../components/ui/ConversationElements";
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
  const carousel = useRef<HTMLDivElement>(null);
  const cars = inventory.filter((c) => ids.includes(c.id));
  const days = duration(trip);
  return cars.length ? (
    <section
      aria-label="Sample vehicle carousel"
      aria-roledescription="carousel"
    >
      <div className="mono-carousel-controls">
        <span>{cars.length} sample vehicles · swipe or scroll to compare</span>
        <button
          type="button"
          aria-label="Previous vehicles"
          onClick={() => carousel.current?.scrollBy({ left: -340 })}
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next vehicles"
          onClick={() => carousel.current?.scrollBy({ left: 340 })}
        >
          →
        </button>
      </div>
      <div
        ref={carousel}
        className="chat-vehicle-grid mono-carousel"
        tabIndex={0}
        aria-label="Vehicle comparisons"
      >
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
    </section>
  ) : (
    <EmptyState title="No sample vehicles meet this brief">
      Change a preference using “Edit my trip”, or ask for a custom enquiry in
      chat.
    </EmptyState>
  );
}
