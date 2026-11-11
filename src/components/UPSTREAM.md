# Untitled UI input foundation

Source: https://github.com/untitleduico/react
Pinned commit: 207c26b47595bf39d9467265055623e1c7082294
License: MIT; see UNTITLED-UI-LICENSE.txt.

Vendored components: Input/InputBase/TextField, InputGroup, Label, HintText, Tooltip and NativeSelect, plus the upstream class-merging helper and semantic theme. Components are built on React Aria and Tailwind CSS. No documentation preview components or demo application code is shipped.

MONO customizations: emerald semantic theme; Vite @ alias; utility-only Tailwind import (no global reset); NativeSelect label/input IDs separated and disabled options forwarded; required indicators are visual CSS markers excluded from accessible names; FieldInput adapter retains native date/time/number constraints while exposing labels, hints, error/disabled/read-only states, optional icons/tooltips and currency prefixes. Controlled string callbacks are available as onValueChange, with native onChange compatibility for existing forms. Forms submit through existing typed domain handlers, independent of Clerk/Supabase/payment vendors.

Only needed components are wired into production. Password visibility is already supported by InputBase. Do not collect raw payment-card details through a generic input: future payments should use gateway-hosted secure fields. File selection must be connected to an authorized upload service before any upload is presented as complete. Provider-controlled authentication screens remain owned by Clerk.

## Conversation component references

The supplied progress, carousel, date-picker, loading, empty-state, messaging, metric, modal, typography and inline-CTA documents are usage references, not implementation files. PRO examples have not been copied. `ConversationElements`, `CalendarPicker` and the MONO carousel/message styling are original compositions using existing shared fields, React Aria ProgressBar/Calendar and Modal/Dialog primitives, and MONO semantic surfaces. Native date inputs remain available alongside keyboard-accessible calendars. The modal is limited to destructive conversation reset confirmation; vehicle review remains inline.

Inline CTAs call existing conversation/domain handlers. Metrics count actual local records. Brief completeness reflects entered details, not search progress. Loading appears only while the workspace code loads. No fake payment-method, receipt, subscription or message-delivery state is rendered. Future Paystack checkout and receipts require authoritative server-confirmed payment records.

## Credit card visual

`shared-assets/credit-card/credit-card.tsx` and `icons.tsx` come from the same pinned MIT source commit above. Added `showNetworkLogo` so the fixed Mastercard mark can be omitted when no verified network is known. `PaymentMethodPreview` always supplies masked placeholders, an illustration label, no cardholder identity and no network mark. It is decorative and hidden from assistive technology; the adjacent text gives the actual state, "No card connected". It collects no input, stores no payment metadata and does not initialize checkout. No source demo card numbers, names or expiry dates are shown in the application. A future payment-method adapter must receive authoritative, masked metadata from the gateway; full PAN/CVV must not enter these components or transcripts.

## Illustrations, QR codes, toggles, utility buttons and carousel

The same MIT commit supplies `shared-assets/illustrations/cloud.tsx` and `documents.tsx`, `shared-assets/qr-code.tsx`, `base/toggle/toggle.tsx`, `base/buttons/button-utility.tsx`, `application/carousel/carousel-base.tsx` and `utils/is-react-component.ts`. Only the small illustration exports are used for decorative empty states. The utility button's placement type comes from the existing TooltipProps rather than relying on a transitive package’s type export.

The vehicle carousel now uses the actual upstream Embla foundation with manual swiping, arrow keys, disabled end controls and a position indicator. No autoplay is configured. The customer automatic-transmission switch updates the existing trip record; the provider switch changes only the device-local storefront preview flag. Neither verifies availability nor publishes a listing.

QR generation uses pinned `qr-code-styling` and is loaded only on demand. The source QR effect now creates a dedicated mount and cleans it up on value changes/unmount, preventing duplicate or stale SVGs. Public QR links are limited to the existing hosted customer/provider entry points; they encode no private draft, account, booking or payment information. Black/emerald-on-white geometry, a quiet margin and no logo overlay favor reliable scanning. A decoding test uses dev-only jsQR to confirm the rendered SVG actually contains the expected URL, including after a role change.

## React Bits TechText

`react-bits/TechText/TechText.tsx` and its CSS are from DavidHDev/react-bits commit `9d9c687dc4f55b23539aa5417b703078047efa74`. This source uses **MIT + Commons Clause**, not the Untitled UI MIT license; the exact license is retained in `react-bits/LICENSE.md`. It permits use within an application/website/product including commercial use, and restricts reselling or redistributing the components themselves as a component product.

GOMONO adds a first-font-ready-frame marker and hides the decorative canvas from assistive technology. `AnimatedBrandMark` dynamically loads the renderer only when motion is allowed, preserves static text if loading or canvas rendering fails, and responds to reduced-motion preference changes. TechText is used for the branded workspace-loading state and its explicitly labelled preview, not prices, booking terms or every chat message. It introduces no artificial waiting period and no payment/search/AI-state claim.

## Optional motion and user-supplied interaction patterns

`react-bits/AnimatedContent/AnimatedContent.tsx` and `react-bits/LogoLoop/LogoLoop.tsx` plus its CSS are from the same React Bits commit and MIT + Commons Clause license above. AnimatedContent loads GSAP dynamically, renders visible by default, fails open if loading fails, and respects reduced motion; it is used only for the explicitly expanded conversation context. GSAP is pinned at 3.15.1 under its own Standard License (https://gsap.com/standard-license), not the React Bits license. LogoLoop loads only when the landing sample-brand band is visible; pause and static reduced-motion/failure fallbacks are provided.

Audi, BMW and Toyota SVGs in `public/brands` come from Simple Icons commit `46d3327aee33fbe00ebfbb5da1543853a295c297`, CC0 1.0; the exact license is retained there. Marks describe sample vehicle brands only, not partnerships, endorsement, verification or confirmed availability. Trademark rights are separate from the artwork license.

The supplied inline disclosure, Family Receive confirmation, save toggle, profile, expandable card grid, pricing and feedback samples are adapted into original GOMONO components using the existing React Aria controls, Untitled UI icons and CSS transitions. Their absent `motion/react`, `framer-motion`, `lucide-react`, Hugeicons, `next-themes` and `base-ui` aliases are not added solely for these samples. The sample product card becomes the existing vehicle comparison card, retaining domain handlers, explicit pricing basis and an actual persistent shortlist. Unsupported fake metrics, wallet/address actions, arbitrary success timers, financial reception and biometric affordances are omitted. All new CSS motion respects reduced motion.

Feedback stores only an explicitly submitted local rating/comment against a role-scoped completion ID. It never claims delivery to GOMONO. The provider pricing pattern previews proposed prices and roadmap features; it never activates subscriptions or simulates checkout. See PROVIDER_SUBSCRIPTIONS.md and UX_FEEDBACK_AUDIT.md.
