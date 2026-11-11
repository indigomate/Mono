import { useId, useState } from "react";
import { providerPlans, type ProviderPlanId } from "../demo/provider-plans";
import { money } from "../demo/marketplace";
import { Check } from "@untitledui/icons";

/** Adapted pricing animation. Selection previews a proposal; it never activates a plan. */
export function ProviderPlans() {
  const [selected, setSelected] = useState<ProviderPlanId>("starter");
  const [yearly, setYearly] = useState(false);
  const prefix = useId();
  return (
    <section className="provider-plans" aria-label="Proposed provider plans">
      <header>
        <div>
          <span className="eyebrow">PLAN PREVIEW · NOT FOR SALE YET</span>
          <h3>Room to grow your business.</h3>
        </div>
      </header>
      <p>
        Compare proposed benefits. Paid tools below are roadmap features, not
        active entitlements. Current demo tools stay available.
      </p>
      <div
        className="plan-cycle"
        role="group"
        aria-label="Preview billing cycle"
        data-yearly={yearly}
      >
        <span aria-hidden="true" className="plan-cycle-indicator" />
        <button
          type="button"
          aria-pressed={!yearly}
          onClick={() => setYearly(false)}
        >
          Monthly
        </button>
        <button
          type="button"
          aria-pressed={yearly}
          onClick={() => setYearly(true)}
        >
          Annual
        </button>
      </div>
      <div className="plan-options">
        {providerPlans.map((plan) => (
          <article
            key={plan.id}
            className="plan-option"
            data-selected={selected === plan.id}
          >
            <button
              type="button"
              className="plan-option-trigger"
              aria-expanded={selected === plan.id}
              aria-controls={`${prefix}-${plan.id}`}
              onClick={() => setSelected(plan.id)}
            >
              <span className="plan-choice" aria-hidden="true">
                {selected === plan.id && <Check width={12} height={12} />}
              </span>
              <span className="plan-option-name">
                <strong>{plan.name}</strong>
                <small>{plan.description}</small>
              </span>
              <span className="plan-price">
                <strong key={String(yearly)}>
                  {money(yearly ? plan.yearly : plan.monthly)}
                </strong>
                <small>
                  {plan.monthly
                    ? yearly
                      ? "/ year upfront"
                      : "/ month"
                    : "free tier"}
                </small>
              </span>
            </button>
            {selected === plan.id && (
              <div id={`${prefix}-${plan.id}`} className="plan-expanded">
                <p>
                  <b>{plan.commission}% booking commission</b> · separate from
                  subscription
                </p>
                {yearly && plan.monthly > 0 && (
                  <p>
                    {money(plan.yearly / 12)} / month equivalent · save{" "}
                    {money(plan.monthly * 12 - plan.yearly)} per year.
                  </p>
                )}
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check aria-hidden="true" width={14} height={14} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>
      <div className="plan-billing-note">
        <b>All tiers keep core safety and customer service.</b>
        <p>
          Commission is proposed on completed rental/service revenue, excluding
          refundable security deposits. Gateway fees and tax treatment must be
          disclosed separately before launch.
        </p>
        <p>
          ZAR pricing is illustrative. Comparing plans does not charge you,
          subscribe you or change your listings.
        </p>
        <button type="button" className="smallbtn" disabled>
          Billing coming soon
        </button>
      </div>
    </section>
  );
}
