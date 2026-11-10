import { DecisionHelp } from "./JourneyContext";
/** No financial selections are stored until authoritative quotes exist. */
export function PaymentChoices() {
  return (
    <section
      className="payment-choices"
      aria-label="Deposit and protection options"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">UNDERSTAND YOUR OPTIONS</span>
          <h3>Choose with the full picture.</h3>
        </div>
        <span className="record-status">Not yet quoted</span>
      </div>
      <div className="payment-choice-grid">
        <article>
          <span className="choice-icon" aria-hidden="true">
            ◇
          </span>
          <h4>With security deposit</h4>
          <p>
            A separate refundable amount secures the vehicle against agreed
            damage or other covered charges.
          </p>
          <dl>
            <div>
              <dt>Rental total</dt>
              <dd>Full quote pending</dd>
            </div>
            <div>
              <dt>Refundable deposit</dt>
              <dd>Amount pending</dd>
            </div>
            <div>
              <dt>Release timing</dt>
              <dd>Disclosed before payment</dd>
            </div>
          </dl>
          <button type="button" disabled>
            Deposit option unavailable
          </button>
        </article>
        <article>
          <span className="choice-icon" aria-hidden="true">
            ✧
          </span>
          <h4>Deposit-free option</h4>
          <p>
            A higher rental rate may replace the upfront deposit where the
            provider and protection terms permit it.
          </p>
          <dl>
            <div>
              <dt>Rental total</dt>
              <dd>Adjusted quote pending</dd>
            </div>
            <div>
              <dt>Eligibility</dt>
              <dd>Provider & coverage approval</dd>
            </div>
            <div>
              <dt>Damage liability</dt>
              <dd>Still subject to agreed terms</dd>
            </div>
          </dl>
          <button type="button" disabled>
            Deposit-free option unavailable
          </button>
        </article>
      </div>
      <p className="payment-explainer">
        No money is reserved or charged while you explore these samples.
        Deposit-free does not mean zero damage liability. Both options need a
        verified quote before selection.
      </p>
      <DecisionHelp />
    </section>
  );
}
