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
