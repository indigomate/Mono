import { EmptyState } from "../components/ui/ConversationElements";
import { inventory, type Trip, money, duration } from "../demo/marketplace";
import { ArrowLeft, ArrowRight } from "@untitledui/icons";
import { ButtonUtility } from "../components/base/buttons/button-utility";
import { Toggle } from "../components/base/toggle/toggle";
import {
  Carousel,
  useCarousel,
} from "../components/application/carousel/carousel-base";

function VehicleCarouselControls({ count }: { count: number }) {
  const { selectedIndex, scrollSnaps } = useCarousel();
  return (
    <div className="mono-carousel-controls">
      <span>{count} sample vehicles · swipe to compare</span>
      <span role="status" aria-label="Vehicle carousel position">
        {selectedIndex + 1} of {scrollSnaps.length || 1}
      </span>
      <Carousel.PrevTrigger>
        {({ isDisabled, onClick }) => (
          <ButtonUtility
            className="gomono-utility"
            icon={ArrowLeft}
            tooltip="Previous vehicles"
            isDisabled={isDisabled}
            onPress={onClick}
          />
        )}
      </Carousel.PrevTrigger>
      <Carousel.NextTrigger>
        {({ isDisabled, onClick }) => (
          <ButtonUtility
            className="gomono-utility"
            icon={ArrowRight}
            tooltip="Next vehicles"
            isDisabled={isDisabled}
            onPress={onClick}
          />
        )}
      </Carousel.NextTrigger>
    </div>
  );
}
export function VehicleCards({
  ids,
  trip,
  onSelect,
  onAutomaticChange,
}: {
  onAutomaticChange?: (selected: boolean) => void;
  ids: number[];
  trip: Trip;
  onSelect: (id: number) => void;
}) {
  const cars = inventory.filter((c) => ids.includes(c.id));
  const days = duration(trip);
  return cars.length ? (
    <section aria-label="Sample vehicle options">
      {onAutomaticChange && (
        <Toggle
          className="gomono-toggle vehicle-filter-toggle"
          label="Automatic only"
          aria-label="Automatic only"
          isSelected={trip.transmission === "Automatic"}
          onChange={onAutomaticChange}
        />
      )}
      <Carousel.Root
        className="vehicle-carousel"
        aria-label="Sample vehicle carousel"
        opts={{ align: "start", containScroll: "trimSnaps", duration: 0 }}
      >
        <VehicleCarouselControls count={cars.length} />
        <Carousel.Content
          className="chat-vehicle-grid mono-carousel"
          tabIndex={0}
          aria-label="Vehicle comparisons"
        >
          {cars.map((c) => (
            <Carousel.Item
              className="vehicle-carousel-item"
              key={c.id}
              aria-label={`${c.name} · sample vehicle`}
            >
              <article className="match-card">
                <div className="match-image">
                  <img
                    src={c.img}
                    alt={`Illustrative ${c.type}`}
                    loading="lazy"
                  />
                  <span>{c.type}</span>
                  <small className="photo-note">Illustrative image</small>
                </div>
                <div className="match-content">
                  <div className="vehicle-trust">
                    <span>Sample collection</span>
                    <span>Verification pending</span>
                  </div>
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
                  <dl className="vehicle-cost-preview">
                    <div>
                      <dt>Daily base</dt>
                      <dd>{money(c.price)}</dd>
                    </div>
                    <div>
                      <dt>Fees & protection</dt>
                      <dd>Quote pending</dd>
                    </div>
                  </dl>
                  <p className="availability-note">
                    Availability unverified · Fees not yet quoted
                  </p>
                </div>
              </article>
            </Carousel.Item>
          ))}
        </Carousel.Content>
      </Carousel.Root>
      {cars.length > 1 && (
        <details className="vehicle-comparison">
          <summary>Compare these {cars.length} samples side by side</summary>
          <div
            className="comparison-scroll"
            tabIndex={0}
            aria-label="Side by side vehicle comparison"
          >
            <table>
              <caption>
                Sample specifications · availability and full prices unverified
              </caption>
              <thead>
                <tr>
                  <th scope="col">Compare</th>
                  {cars.map((c) => (
                    <th scope="col" key={c.id}>
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Base / day", ...cars.map((c) => money(c.price))],
                  ["Transmission", ...cars.map((c) => c.transmission)],
                  ["Passengers", ...cars.map((c) => String(c.seats))],
                  ["Pickup area", ...cars.map((c) => c.area)],
                  ["Availability", ...cars.map(() => "Unverified")],
                ].map(([label, ...values]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {values.map((v, i) => (
                      <td key={cars[i].id}>{v}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row">Next step</th>
                  {cars.map((c) => (
                    <td key={c.id}>
                      <button onClick={() => onSelect(c.id)}>
                        Review {c.name}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      )}
    </section>
  ) : (
    <EmptyState title="No sample vehicles meet this brief" illustration="cloud">
      Change a preference using “Edit my trip”, or ask for a custom enquiry in
      chat.
    </EmptyState>
  );
}
