# GOMONO design system

GOMONO is a conversation-first Cape Town rental concept. Its landing page uses cinematic car photography, glossy layered emerald gradients, generous whitespace, and oversized RENT SMARTER typography. Book a Car and List Your Car lead directly to the existing renter and owner experiences.

## Tokens and hierarchy

- Ink / page: #03130f; workspace green: #031b15; interactive green: #075340; primary emerald: #00a98a; highlight: #57efc5.
- Light workspace: #fafaf9; cards: white; secondary text: #626966.
- Manrope for display and branding, DM Sans for interface text, system sans-serif fallback. Google Fonts needs network access.
- Pill conversion buttons and suggestions; 16–19px card corners; restrained shadows; clear border separation.
- Hero uses a locally stored Unsplash photograph. Vehicle photos remain external illustrative examples, not verified photos of the advertised model.

## Responsive behavior

Desktop uses a full sidebar and two-column results; tablet uses an icon rail and single-column results; mobile uses persistent workspace tabs. The composer remains within the viewport using dynamic viewport height. Landing page actions wrap and the hero image moves behind the display headline.

## Accessibility and honesty

Use native buttons, visible keyboard focus, labeled inputs, live conversation announcements, minimum mobile touch heights, and reduced-motion support. No availability, verification, payment, or booking confirmation may be implied by demo results. Browser-local requests are always labeled as demonstrations. Production onboarding must visibly distinguish verification stages from completion.

## Next design milestones

Validate keyboard and screen-reader flows with users; replace prompt/alert dialogs with accessible contextual forms; add explicit active mobile tab styling and design tokens shared across components. Validate the design with real vehicle photography and approved business copy before launch.

## Guided workspace

The cinematic landing page is retained. The application workspace pairs a deep emerald navigation rail with soft ivory-green surfaces, white vehicle cards and restrained forest-green actions. A right-hand trip brief keeps preferences visible on desktop; a compact summary precedes the conversation on mobile. Vehicle details and estimate review use a keyboard-accessible modal. Owner cards show local draft/preview status with clear next steps. Mobile tabs expose aria-current and a visible selected state. Native controls preserve accessible names, browser date pickers and validation.

## Distinct customer and provider experiences

Rent & Ride uses a service-first dashboard and customer-only navigation. Provider Studio uses a business overview, setup checklist and provider-only navigation. Both retain the GOMONO emerald/ivory identity but have explicit workspace labels and slightly distinct sidebar treatments. Moving between roles requires the Change workspace chooser. Service enquiry forms emphasize the appropriate route/timing requirements and quote-required status; they do not resemble instant self-drive checkout. Provider reference rates always show their unit.

## Chat-first correction

The active UI now treats the conversation as the workspace on both sides. Dashboard navigation is replaced with one conversation entry per role. Tool cards appear within assistant messages, and a persistent composer allows follow-ups during any workflow. Service choices are conversational options, not a separate service dashboard. Untitled UI fields use GOMONO's emerald semantic theme, consistent labels, focus/error states, hints, icons and currency prefixes. See CONVERSATION_ARCHITECTURE.md; older dashboard descriptions above record earlier milestones only.

### Conversation component language

Inline action cards place a contextual next step inside the thread. Empty states explain what is missing and use existing chat actions for recovery. Vehicle comparisons use a manual, scrollable carousel with buttons and no autoplay. Date fields retain native entry and add optional React Aria calendars. Brief completeness counts entered details only. Provider metrics report saved local records and preview selections, never hypothetical revenue. Messaging retains role labels and an explicit device-local demo notice. Reset confirmation uses a focus-contained, dismissible dialog; vehicle and quote review remain inline. Loading respects reduced-motion preferences and appears only during actual workspace loading. Body text uses readable line spacing and bounded line length; the cinematic landing typography stays intact.

### Visible customer and provider journeys

The emerald conversation welcome offers role-specific starting points. Customer choices cover self-drive, chauffeur, groups and the complete service catalogue. Provider choices start a listing, business setup or inbox review. These dispatch chat commands without changing workspaces.

A compact brief pocket sits above the customer composer. Its summary stays visible; expansion reveals editable route, dates/time, passenger count and budget. It reflects the current service form or self-drive trip state, survives reload through existing persistence, and opens the relevant inline editor. The journey strip derives planning/options/review from actual conversation tools. Payment and confirmed stages stay inactive in the demo. The provider pocket offers draft resumption, business details and incoming-request actions.

Vehicle cards use larger illustrative images, prominent sample/verification labels, explicit daily base pricing and a side-by-side specification table. Quote review explains deposit and deposit-free options without quoting invented amounts or permitting selection. Cancellation, protection, payment timing and deposit-release disclosures sit at decision points for vehicle and transport service paths.

Saved-request cards provide a reference, itinerary, payment/confirmation state and a useful continuation action. Service enquiries can be copied into an editable brief without overwriting history. Local records never become confirmed bookings based on their free-text status. Live booking cards will require authoritative provider, pickup, payment and support details from the future booking service.

Provider summaries show concrete readiness actions and local supply counts. Listing/profile editors show entered-detail completeness. Supply cards disclose pending documents and availability; availability planning currently uses listing notes, not a verified calendar. Responsive brief expansion is bounded so the composer remains available; short-height screens simplify the journey strip.

### Make the interface discoverable

The landing experience section is an interactive entry into the product, not a separate component showroom. It reuses the shared input, progress, inline CTA, loading and local metric components. Customer/provider choices carry explicit user commands into the same role-scoped chat. A labelled animation preview allows design review without pretending a request is processing. Fresh provider entry includes summary metrics; dates and progress are visible near the top of customer editors. Start here makes welcome actions recoverable after a long conversation. GOMONO is the visible brand; the new logo/icon work remains separate.

### Contextual shared assets

Small cloud/document illustrations replace the generic star in empty results and histories. Utility buttons keep carousel and close controls compact, with accessible names, tooltips and touch targets. Preference switches represent real local state changes, including automatic transmission and storefront-preview inclusion. Vehicle comparisons use the upstream manual Embla carousel. A single optional QR utility in the landing preview opens the public experience on a phone, with its real URL and device-local-data limitation stated beside it. QR sharing is not placed in the main conversation or used as an invented booking/payment credential. The broader fluid-chat redesign remains a proposal in CONVERSATION_EXPERIENCE_PLAN.md.

## Progressive conversation controls

Start with chat and a green three-suggestion area. Put context behind Trip details / Business details, closed initially, with a bounded scroll area that leaves the composer available. Put low-frequency commands in Conversation actions. Expanded trip tiles show current values and return editing to chat. Provider identity uses a collapsed card in storefront preview, with saved fields and explicit local/unverified status rather than decorative analytics.

Vehicle product cards use a fixed image frame, concise specification badges, a price with its basis, one View car action and an independent saved-car overlay. Extra costs/verification expand on demand. A real image request controls its placeholder/error/retry state. Save success follows persistence, with a visit-only label when browser storage fails.

Use small, purposeful entrances; no decorative delays. TechText belongs in workspace loading and its labelled preview; LogoLoop belongs in the landing sample-brand band with Pause and reduced-motion static marks. Confirmation, pricing and completion feedback share rounded emerald surfaces. Financial activation is unavailable until the real services exist. See UX_FEEDBACK_AUDIT.md and PROVIDER_SUBSCRIPTIONS.md.

## Current 12ui Design refinement

The current visual layer is based on 12ui’s selected landing A and corrected chat B, with a site branch covering forms, provider states and pricing. Inter is the primary refined UI/display family; the existing optional loading wordmark retains its Manrope setting. Cinematic emerald imagery remains on the landing/role chooser, while the workspace uses ivory, white and pale mint for reading. The narrow rail keeps its one real conversation action; secondary commands stay in the disclosure menu. Local illustrative vehicle art improves model consistency without asserting verified photos or inventory.

See 12UI_UPGRADE.md for source IDs, alignment results, intentional functional/content deviations and validation. Earlier milestone descriptions above are historical; active tasks remain in conversation.

## Minimal surfaces

The landing page keeps its cinematic hero, the two primary role actions and the eleven-brand strip. A compact role selector and message field replace the simulated dashboard/component showcase. Keep the explanation to three brief steps and one owner entry. Loading animation previews, demo metrics and duplicated product pitches are not marketing content.

Both workspaces use one header with a home logo, active role and workspace switch. Keep two welcome choices, three green suggestions and the composer. Secondary operations belong in Conversation actions; business readiness belongs behind an explicit disclosure. The welcome disappears when a user sends a message, and Start here can reveal it again. A provider business summary is requested explicitly rather than injected into first entry. The existing emerald/ivory tokens, vehicle cards, actual loading state and accessible form components remain.

See MINIMALISM_AUDIT.md for the removal/preservation mapping and 12ui generation limitation.

## Conversation feedback

Keep delete controls small but accessible on every message, with a 44px touch target on coarse pointers. Confirmation identifies the message and explains that business records remain. New replies use a three-dot preparation indicator, followed by readable text and then the relevant inline card. Stagger only small sets of vehicle/service options; do not trickle individual form fields into view. Indicators stop when ready and must not imply live search, AI streaming or account synchronization. Respect reduced motion and never replay the entire stored transcript as fresh output.
