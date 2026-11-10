import { money, type Request } from "../demo/marketplace";
export function RequestRecord({
  request,
  onContinue,
}: {
  request: Request;
  onContinue: () => void;
}) {
  return (
    <article className="request-card journey-record">
      <header>
        <span className="eyebrow">SELF-DRIVE / LOCAL DEMO REQUEST</span>
        <span className="record-status">Saved · not submitted</span>
      </header>
      <h3>{request.car}</h3>
      <p>
        {request.start} → {request.end}
      </p>
      <b>{money(request.total)} estimated base rental</b>
      <dl>
        <div>
          <dt>Payment</dt>
          <dd>No payment collected</dd>
        </div>
        <div>
          <dt>Provider & pickup</dt>
          <dd>Awaiting verified supply and pickup instructions</dd>
        </div>
        <div>
          <dt>Confirmation</dt>
          <dd>No booking confirmed</dd>
        </div>
      </dl>
      <p className="record-next">
        Next: review the vehicle and full terms before any live booking.
      </p>
      <button className="smallbtn" onClick={onContinue}>
        Review this vehicle in chat →
      </button>
      <details>
        <summary>Request reference & contact</summary>
        <p>{request.id}</p>
        <p>{request.email}</p>
        <p>
          For help with this local brief, continue in the MONO conversation.
          Live support delivery is not connected.
        </p>
      </details>
    </article>
  );
}
