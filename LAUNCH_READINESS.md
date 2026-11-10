# GOMONO launch readiness

## Current decision

Ready for invited usability testing of the labelled demo. Not ready to accept real rental bookings, payments or sensitive verification documents. Domain registration is deferred; the existing Vercel URL remains the preview address.

## Evidence from this audit

- Browser: landing → separate customer/provider chats → inline tools → local saved records works. Previously, no date calendar or metric card appeared at customer entry, explaining why the component additions were hard to see.
- Data: the connected project `vgotgieufkctvhtgsdnt` returned `{"tables":[]}` for the public schema. No application schema or migrations exist in this repository. This does not establish the contents of private schemas.
- Identity: local `VITE_CLERK_PUBLISHABLE_KEY` is empty. The source conditionally renders Clerk only when configured. Presence of public Supabase configuration does not prove live business services exist.
- Integration boundary: `createMarketplaceClient` and `useMarketplaceClient` are factories, not active business flows. Current customer/provider components call demo storage, not authenticated APIs. No booking, payment, webhook or provider-delivery handlers exist.
- Conversation: intent and field extraction are bounded demo logic, not a connected LLM. This must be explained to test users.

## Work required before a real booking pilot

| Priority | Work                                                          | Acceptance evidence                                                                                                                                                                                                                                                                                                                     |
| -------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Clerk sign-in and server-enforced customer/provider ownership | Real account login/logout/recovery works. Two different accounts cannot read or change one another’s private records.                                                                                                                                                                                                                   |
| 2        | Persistent marketplace data in Supabase                       | Profiles, listings, briefs, conversations and addressed requests survive sign-in on a second device. Ownership policies and denial tests pass. Demo data never becomes live supply by default.                                                                                                                                          |
| 3        | Verified, usable supply                                       | Recruit an initial Cape Town provider cohort; verify vehicles/operators, documents and applicable coverage. Publish only approved supply with accurate images, service areas and actual rates.                                                                                                                                          |
| 4        | Availability, quotes and booking lifecycle                    | Provider receives and answers a real request. Server validates dates, provides a full expiring quote and prevents overlapping reservations. Customer explicitly accepts terms. Expired/rejected requests release inventory.                                                                                                             |
| 5        | Paystack and commercial rules                                 | Settle transparent commission/service-fee amounts and standardized security-deposit/rate bands. Confirm merchant eligibility and available reservation/capture features. Implement hosted checkout, signed webhooks, idempotency, refunds, deposit handling and payout reconciliation. Exercise failed/cancelled/duplicate event paths. |
| 6        | Fulfilment and recovery                                       | Confirmed booking shows actual provider/contact, pickup instructions and payment state. Email/in-app notifications reach the right person, retries are monitored, and support can resolve cancellations, damages and refunds.                                                                                                           |
| 7        | Pilot operating requirements                                  | Publish privacy/POPIA disclosures, rental/cancellation/protection terms, support contacts and provider agreements. Test backups, error monitoring, accessibility, rate limits and an operational incident/refund process.                                                                                                               |

A pilot may use explicitly disclosed manual provider verification and assisted operations. Automated dashboards, public SEO storefronts, subscriptions and international expansion are not prerequisites for the first controlled booking pilot. Secure identity, authoritative prices/availability, money reconciliation and real customer support are prerequisites.

## What users can explore now

Open `/#experience` on the existing preview site. The landing section uses actual shared React fields, sample vehicle presentation, local provider metrics, inline CTAs and brief progress. The loading animation is available as an explicitly labelled visual preview; it never represents a running vehicle search. Actions open the corresponding customer/provider conversation and consume the user’s command once.

Inside chat, use **Start here** to return to the welcome choices without clearing history. **Plan dates & budget** exposes the date calendar and structured fields. **Drive myself** opens the vehicle carousel and comparison. **Track my requests** exposes saved records or an empty state with a continuation action. Provider entry exposes the business summary, metrics and readiness cards. **New chat** opens the accessible confirmation dialog. Deposit explanations appear during vehicle estimate review, with selection unavailable until authoritative financial quotes exist.

The supplied documentation included paid examples without source. The product uses MIT Untitled UI primitives and original GOMONO compositions; it does not claim to ship unavailable PRO example code. The new custom logo/icon design remains a separate brand-design task.

## Build and operational audit

The current TypeScript/Vite build and formatting checks pass; production dependencies report zero known npm audit vulnerabilities. GitHub runs build, formatting and the browser journeys on every push. The user-facing frontend is deployed through the existing Vercel project. Workspace load-failure recovery is included, but centralized error reporting, delivery monitoring, reconciliation alerts and production incident ownership remain launch work. Automated tests validate demo workflows and recovery, not authenticated bookings or money movement.
