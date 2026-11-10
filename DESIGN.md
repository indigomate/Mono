# MONO design system

MONO is a conversation-first Cape Town rental concept. Its landing page uses cinematic car photography, glossy layered emerald gradients, generous whitespace, and oversized RENT SMARTER typography. Book a Car and List Your Car lead directly to the existing renter and owner experiences.

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

Rent & Ride uses a service-first dashboard and customer-only navigation. Provider Studio uses a business overview, setup checklist and provider-only navigation. Both retain the MONO emerald/ivory identity but have explicit workspace labels and slightly distinct sidebar treatments. Moving between roles requires the Change workspace chooser. Service enquiry forms emphasize the appropriate route/timing requirements and quote-required status; they do not resemble instant self-drive checkout. Provider reference rates always show their unit.

## Chat-first correction

The active UI now treats the conversation as the workspace on both sides. Dashboard navigation is replaced with one conversation entry per role. Tool cards appear within assistant messages, and a persistent composer allows follow-ups during any workflow. Service choices are conversational options, not a separate service dashboard. Untitled UI fields use MONO's emerald semantic theme, consistent labels, focus/error states, hints, icons and currency prefixes. See CONVERSATION_ARCHITECTURE.md; older dashboard descriptions above record earlier milestones only.

### Conversation component language

Inline action cards place a contextual next step inside the thread. Empty states explain what is missing and use existing chat actions for recovery. Vehicle comparisons use a manual, scrollable carousel with buttons and no autoplay. Date fields retain native entry and add optional React Aria calendars. Brief completeness counts entered details only. Provider metrics report saved local records and preview selections, never hypothetical revenue. Messaging retains role labels and an explicit device-local demo notice. Reset confirmation uses a focus-contained, dismissible dialog; vehicle and quote review remain inline. Loading respects reduced-motion preferences and appears only during actual workspace loading. Body text uses readable line spacing and bounded line length; the cinematic landing typography stays intact.
