import { services, type ServiceType } from "../demo/services";
import { type Trip, type Request, money } from "../demo/marketplace";
import { type Navigate } from "./navigation";
export function CustomerDashboard({
  trip,
  requests,
  inquiryCount,
  navigate,
  onService,
}: {
  trip: Trip;
  requests: Request[];
  inquiryCount: number;
  navigate: Navigate;
  onService: (service: ServiceType) => void;
}) {
  return (
    <>
      <div className="eyebrow">RENT & RIDE / YOUR DASHBOARD</div>
      <div className="dashboard-welcome">
        <div>
          <h2>Wherever life takes you.</h2>
          <p>
            A car for yourself. A driver for the day. Transport for everyone.
          </p>
        </div>
        <span className="dashboard-location">Cape Town, South Africa</span>
      </div>
      <div className="customer-overview">
        <div>
          <span>Saved rental requests</span>
          <b>{requests.length}</b>
        </div>
        <div>
          <span>Saved service enquiries</span>
          <b>{inquiryCount}</b>
        </div>
        <button onClick={() => navigate("bookings")}>
          View my requests <span>→</span>
        </button>
      </div>
      <div className="section-heading">
        <div>
          <span className="eyebrow">START WITH WHAT YOU NEED</span>
          <h2>One place. Every way to move.</h2>
        </div>
      </div>
      <div className="service-grid">
        {services.map((s) => (
          <button
            key={s.id}
            className={`service-card service-${s.id}`}
            onClick={() => onService(s.id)}
          >
            <span className="service-card-top">
              <small>{s.icon}</small>
              <span>→</span>
            </span>
            <h3>{s.label}</h3>
            <p>{s.description}</p>
            <b>
              {s.id === "self-drive"
                ? "Explore sample vehicles"
                : "Prepare a service enquiry"}{" "}
              →
            </b>
          </button>
        ))}
      </div>
      <div className="customer-lower-grid">
        <section className="resume-card">
          <span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span>
          <h3>Your self-drive trip</h3>
          <p>
            {trip.location} · {trip.category || "Any vehicle"}
            {trip.budget
              ? ` · ${money(trip.budget)} ${trip.budgetMode === "total" ? "total" : "/ day"}`
              : ""}
          </p>
          <button className="smallbtn" onClick={() => navigate("chat")}>
            Continue trip →
          </button>
        </section>
        <section className="scope-card">
          <h3>From two wheels to a whole group.</h3>
          <p>
            Explore cars, SUVs, luxury vehicles, vans, minibuses, bakkies,
            motorcycles, campers and trucks. A custom enquiry covers needs
            outside our sample inventory.
          </p>
          <span>
            All availability and service quotes require provider confirmation.
          </span>
        </section>
      </div>
    </>
  );
}
