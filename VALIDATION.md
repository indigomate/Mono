# Validation: chat-first UI release

## Completed local checks

- TypeScript validation and Vite production build pass. Conversation code loads separately from the landing entry point.
- 37 Chromium tests pass (including the component and visible-journey checks below): distinct chat entry points and no active dashboards; inline self-drive detail/estimate/save; context and budget handling; estimate-date resumption; airport slot collection through messages; all other service paths saved in chat; no accidental service switch from an airport address; provider add/edit/preview; unfinished profile/listing persistence; quote-only rates; no simulated publishing; role transcript separation; new-chat confirmation; earlier-tool reopening; composer/field usability at 375/768/1440px; legacy links and malformed-data recovery; Untitled UI labels, prefixes, focus and invalid-field states.
- Formatting checks pass and dependency audit reports zero vulnerabilities at validation time.
- Desktop/mobile customer and provider chat screenshots inspected, with no browser runtime errors in smoke journeys.

## Component provenance

The active input layer uses the actual MIT-licensed Untitled UI React primitives pinned at 207c26b47595bf39d9467265055623e1c7082294. React Aria handles accessibility and field state; Tailwind provides the source styles, with GOMONO brand tokens. Label IDs, accessible required indicators and disabled select options have small documented fixes. No documentation-only demos, preview widgets or payment-card collection fields are shipped.

## Release and live verification

The application deploys from GitHub main to https://mono-ochre-psi.vercel.app. Verify the updated conversation UI and run the browser suite against that URL after pushing. A Git push alone is not deployment evidence.

## Limits

The assistant uses bounded demo intent/slot handling, not a connected general-purpose LLM. Requests, profile/listing drafts, transcripts and preview flags remain local. No live availability, quote engine, provider delivery, payment, verification or public publishing is simulated. Clerk and Supabase foundations are retained but those production workflows are not connected. Role selection and separate UI scopes do not replace server-side authorization. A full assistive-technology audit and authenticated integration tests remain future work.

## Conversation component additions

The browser suite now also verifies native-date/calendar synchronization, brief-completeness semantics, reset-dialog focus containment and restoration, local provider metrics, an inline CTA continuing the provider thread, and mobile vehicle-carousel controls. The existing end-to-end role, persistence, request and responsive journeys remain required. Component reference documents are not executed or shipped as demo wrappers.

### Visible journey checks

The suite additionally covers role-specific welcome actions, planning/options/review transitions and reset, disabled unquoted financial choices with damage-liability disclosure, service-brief editing and persistence from the composer pocket at 375×667, side-by-side comparison continuing to inline review, and provider readiness actions preserving workspace separation. Service-history revision is verified to preserve the original record until an explicit new save; live payment and booking confirmation remain unavailable.

## Frontend visibility and GOMONO release

The landing page now renders the real shared input, progress, inline CTA and metric components, sample imagery and conversation presentation. Its customer/provider actions and form submissions enter the corresponding chat exactly once and preserve existing history. The loading animation has a clearly labelled preview and is reused for actual workspace loading. No artificial vehicle-search delay is introduced.

Trip and service calendars are expanded near the beginning of their editors. Pointer selection is verified after native date input: the native editor is blurred before React Aria handles the press, preventing Chromium from scrolling back to the focused input mid-click. Provider metrics appear on fresh entry; Start here restores welcome choices without clearing the transcript. Empty customer history has an actionable recovery card.

Six additional tests cover the landing-to-chat handoff and history persistence, real provider draft counts after returning home, visible components and reduced-motion loading at 375/768/1440px, and default provider metrics/welcome restoration. Visible brand text is GOMONO; existing storage keys and repository/deployment addresses remain stable. See LAUNCH_READINESS.md for the evidence-based production gaps.
