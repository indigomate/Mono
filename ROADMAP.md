# GOMONO roadmap

## 0 — Working concept (this delivery)

React/TypeScript/Vite entry, preserved landing and demo flows, restored hero image, mobile navigation, guarded demo storage, documentation, build and browser validation. No real bookings or verified availability.

## 1 — Typed interaction foundation

Replace compatibility DOM modules incrementally with typed React components and service interfaces; formalize routing, accessible dialogs, form validation, error boundaries, and service failure states. Add CI, dependency updates, observability, and accessibility testing. Acceptance: every existing demo journey continues to work without mixed ownership of DOM nodes.

## 2 — Verified owner supply

Implement authenticated renter/owner roles and server-enforced access. Add business, vehicle, insurance and payout verification; private document storage; moderated fleet management; real image uploads and audit trails. Acceptance: unauthorized users cannot access another owner's data and only approved inventory is publicly discoverable.

## 3 — Discovery and availability

Connect structured conversational search to real inventory, locations, date constraints, authoritative quotes, availability calendars and atomic expiring holds. Acceptance: concurrent requests cannot reserve overlapping vehicle dates; the concierge cannot invent prices or availability.

## 4 — Transactions

Implement booking state machines, a South Africa appropriate payment provider, webhook verification, deposits, cancellation/refund policies, rental agreements, and owner payout reconciliation. Acceptance: retries cannot double charge, and booking/payment state reconciles reliably.

## 5 — Marketplace launch

Add owner dashboards, publicly rendered SEO storefronts with structured data/canonicals/sitemaps, real-time notifications, delivery retry monitoring, and customer support workflows. Conduct security, performance, accessibility, POPIA and legal review. Acceptance: production readiness checks pass, operational ownership is assigned, and payment/refund recovery is exercised.

## 6 — Growth

Calendar integrations, subscriptions, clearly labeled sponsored placement, reviews, retention analytics, and expansion beyond Cape Town. Define metrics and approval criteria before implementing each milestone. No dates are committed until product scope and production vendors are selected.

## Delivered guided-workflow milestone

Typed React workspace, persistent structured trip brief and conversation, daily/total budget handling, preserved make/category/transmission preferences, editable trip fields, vehicle detail and estimate review, honest local request timelines, editable owner drafts, local storefront selection, selected mobile navigation and browser Back support are implemented. The cinematic landing remains intact. Live owner identity, verified supply, availability, notifications, booking transitions and payment services remain future milestones.

## Delivered: separate customer and provider workspaces

The shared mixed menu is replaced with independent Rent & Ride and Provider Studio dashboards, menus, state ownership and forms. Eight transport-service paths and broader vehicle categories are defined. Driver-led and custom services use saved enquiry briefs with no invented prices. Provider identity, multi-service listings and reference-rate units are separate from customer demand.

Next, develop each side independently: customer comparison/request tracking and provider verification/availability/quote response. Connect the two through authenticated, addressed requests only after Supabase ownership policies and service delivery are verified. Quote, availability, notifications, payments and public publishing remain future live-service milestones.

## Current architecture: conversation first

The dashboard-first milestone has been superseded. The active customer and provider experiences use separate persisted transcripts, inline typed tools and an always-available composer. All future inventory, identity, availability, quote, payment, upload and notification integrations must extend this architecture. AGENTS.md and CONVERSATION_ARCHITECTURE.md define the permanent product contract. The bounded demo interpreter can later be replaced by a server-side LLM adapter without redesigning task screens.

### Visible journey refinement — delivered

Role-specific conversation welcome, persistent editable brief, honest journey strip, richer vehicle comparison, deposit/protection explanations, contextual terms, request records with continuation actions, and provider launch-readiness cards are implemented. Live availability calendars, verified provider badges, selectable financial quotes, confirmed booking fulfilment cards and real support delivery remain dependent on production services; local presentation does not imply those integrations exist.

## Next conversation and monetization milestones

- Delivered: closed-by-default context, three green suggestions, command disclosure, branded optional motion, compact vehicle preview/photo recovery, local saved cars, saved-provider identity preview and local completion feedback.
- Proposed, visible but not billable: Starter/Grow/Fleet provider subscriptions with continuing transaction commissions. Validate economics and deliver useful paid tools before activating sales. See PROVIDER_SUBSCRIPTIONS.md.
- Next UX work: consistent private composer/editor draft autosave, reading-aware scrolling, contextual suggestions and truthful async processing states. See UX_FEEDBACK_AUDIT.md.
- Production prerequisite: server-authoritative availability/booking, Clerk ownership/RLS, verified Paystack checkout/webhooks/ledger and subscription entitlements, reconciliation, policy and real feedback collection.
