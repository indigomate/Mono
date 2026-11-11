# Provider subscriptions and commission proposal

Status: product proposal and visible, non-billable preview. Prices and features are not launch commitments. The existing demo is not gated by these proposed limits.

Subscriptions pay for operating tools and capacity; booking commissions pay for marketplace transactions. Customers can continue discovering services and planning through chat. Providers compare memberships from Conversation actions → Provider plans, or by asking “compare provider plans”. The interface remains a provider conversation, with no separate dashboard or disruptive upgrade popup.

| Proposal                                                  | Starter  | Grow     | Fleet     |
| --------------------------------------------------------- | -------- | -------- | --------- |
| Monthly subscription, ZAR                                 | R0       | R499     | R1,499    |
| Annual upfront, ZAR                                       | R0       | R4,990   | R14,990   |
| Annual monthly equivalent                                 | R0       | R415.83  | R1,249.17 |
| Commission on eligible completed revenue                  | 12%      | 10%      | 8%        |
| Active vehicle/service listings                           | 2        | 10       | 50        |
| Operator seats                                            | 1        | 3        | 10        |
| Core chat, listing, requests and standard storefront      | Included | Included | Included  |
| Calendar, bulk availability, saved replies                | —        | Proposed | Proposed  |
| Analytics, CSV export, enhanced storefront                | —        | Proposed | Proposed  |
| Multi-location, assignments, advanced reports             | —        | —        | Proposed  |
| API/webhooks, audit history, priority operational support | —        | —        | Proposed  |

Paid features are roadmap work, not already connected tools. All tiers must retain verification requirements, accurate availability, clear pricing, essential notifications, refund/dispute access, accessibility and core customer support. Payment never buys a verification badge or a false ranking claim. Sponsored placement, if introduced, must be labelled separately.

Annual pricing is ten monthly payments paid upfront, a proposed 16.7% saving. The preview shows the actual annual charge, not just a monthly equivalent. Taxes, gateway charges, cancellation, renewal, refunds and availability of a live offering need a final disclosed policy before sale. Future international plans require separately approved currency/market price versions.

## Commission and commercial rationale

Proposed commission basis: completed vehicle/service rental charges after eligible discounts and reversals. Exclude refundable damage/security deposits, taxes and separately disclosed pass-through charges. Subscription fees are a separate product, never deducted from a security deposit. Refunds/cancellations must reverse the appropriate commission through the ledger; gateway fee reversals depend on actual processor policy.

Example before tax/gateway costs: R10,000 of eligible completed revenue produces R1,200 commission on Starter; Grow produces R1,000 commission plus R499 subscription. At this volume Starter costs less. Grow’s 2-point commission saving alone offsets R499 at R24,950/month. Fleet versus Grow has a R1,000 fee difference and 2-point commission difference, offset at R50,000/month. Providers should choose on actual tool value and volume; no claimed guaranteed earnings or automatic “best value” badge.

Validate acquisition, conversion, fleet sizes, contribution margin, support cost, churn and completed revenue before fixing prices. Don’t put every useful feature behind payment: a usable free tier is essential for marketplace supply. Start with Starter and Grow commercially; launch Fleet when team permissions and operations tools are ready.

## Billing and entitlement architecture

1. Clerk identifies a provider organization; server checks ownership and role. Supabase stores versioned plan definitions, subscription records, provider memberships, effective-dated entitlements and immutable billing/commission ledger entries under RLS. Never derive paid access from client-selected plan state.
2. Chat opens a secure subscription review showing currency, exact amount due, billing interval, next renewal, tax, commission basis and cancellation terms. Explicit approval starts Paystack-hosted checkout through a server endpoint. Secret keys never enter Vite/client code.
3. Confirm Paystack recurring methods, ZAR support and merchant approval for the business model before implementation. Recurring subscription billing is separate from rental payments and damage-deposit handling; do not imply escrow or card authorization holds are supported without verification.
4. Verify webhook signatures over raw bytes, deduplicate event IDs, re-query authoritative processor state, and update subscription/entitlements transactionally. Browser return URLs alone must never activate a plan. Handle delayed and out-of-order webhooks, reconciliation and retries.
5. Use states such as pending, active, past_due, cancel_at_period_end and cancelled. A provisional seven-day failed-renewal grace period requires approved policy. Never delete listings on downgrade: retain drafts, explain limits and let the provider choose which listings remain active. Preserve existing bookings and customer-service obligations.
6. Lock the applicable commission policy/version onto each accepted booking; don’t retroactively change quotes or commission. Enforce limits server-side for listing activation, seat invitations, exports and API access. Cancellation and renewal actions remain accessible in chat with secure confirmation.
7. Test duplicate/late webhooks, failed payments, currency/amount mismatches, refunds, cross-provider access, grace periods and downgrade-over-limit behavior before enabling live checkout.

## Delivered preview

The supplied pricing pattern is adapted to GOMONO: emerald sliding billing selector, animated price changes, expandable plan features, keyboard-operable buttons and reduced-motion support. Only one plan’s details expand at a time. “Billing coming soon” is disabled. Selection is an in-memory comparison, not a saved subscription, payment or entitlement. Existing demo functionality remains available.
