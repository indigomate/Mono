import { CreditCard } from "../shared-assets/credit-card/credit-card";

/** Illustration only. Payment credentials must never be collected in chat. */
export function PaymentMethodPreview() {
  return (
    <aside className="payment-method-visual" aria-label="Card payment preview">
      <div className="payment-card-art" aria-hidden="true">
        <CreditCard
          type="brand-dark"
          company="PAYMENT PREVIEW"
          cardNumber="•••• •••• •••• ••••"
          cardHolder="ILLUSTRATION ONLY"
          cardExpiration="— / —"
          showNetworkLogo={false}
          width={132}
        />
      </div>
      <div className="payment-method-copy">
        <span className="eyebrow">PAYMENT METHOD</span>
        <h4>No card connected</h4>
        <p>
          Card illustration only. Secure checkout with Paystack is planned; no
          card details are collected here.
        </p>
      </div>
    </aside>
  );
}
