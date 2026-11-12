# Validation: chat-first UI release

## Visual audit and interaction pass — 12 November 2026

- `npm run build`: passed.
- `npm run format:check`: passed.
- `npm test -- --workers=2`: 63 passed.
- Chromium visual smoke: landing/customer/provider at 1440×900 and 390×844, no page errors or horizontal overflow.
- React Aria state smoke: primary CTA reported hover and pressed states; native landing scroll updated progress and reveal state.
- WebKit smoke: workspace scroll ownership and composer visibility passed at 2048×828, 768×700, 375×667 and 375×400; clear/reload and landing scroll passed with no page errors.
- Reduced motion: reply sequence, landing reveals, loading transition and logo loop remain static and usable.

## Completed local checks

- TypeScript validation and Vite production build pass. Conversation code loads separately from the landing entry point.
- 55 Chromium tests pass (including the component and visible-journey checks below): distinct chat entry points and no active dashboards; inline self-drive detail/estimate/save; context and budget handling; estimate-date resumption; airport slot collection through messages; all other service paths saved in chat; no accidental service switch from an airport address; provider add/edit/preview; unfinished profile/listing persistence; quote-only rates; no simulated publishing; role transcript separation; new-chat confirmation; earlier-tool reopening; composer/field usability at 375/768/1440px; legacy links and malformed-data recovery; Untitled UI labels, prefixes, focus and invalid-field states.
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

## Load-failure recovery

The first live sweep overlapped a deployment and passed 35/37 checks; the two missing-workspace failures passed when repeated against the stable deployment. Initial error captures lacked network/console traces, so a precise cause was not established. A subsequent live browser smoke check reported no runtime errors or failed requests, and both release CI runs passed. A WorkspaceBoundary now catches workspace load/render failures, shows an explicit reload action, preserves stored records, and displays any pending entry text for copying. A browser test aborts the workspace module request, verifies this fallback, then restores the network and verifies reload with the original saved budget. The final stable-release suite must pass before release verification is reported complete.

Impossible ISO-like dates from chat and corrupt stored dates are rejected/normalized before calendar parsing. Two additional browser checks cover February 31 in a service conversation and invalid persisted trip/service dates while preserving unrelated pickup, email and budget data. Calendar parsing also has a defensive null fallback.

## Credit card illustration

Quote review uses the pinned MIT Untitled UI credit-card visual with masked placeholders and its hardcoded Mastercard mark disabled. A mobile browser check verifies that it appears only in quote review, says no card is connected, contains no payment inputs or source demo identity/number, preserves disabled unquoted financial options, and does not overflow the screen. The fluid-conversation redesign and background cloud saving remain a proposal in CONVERSATION_EXPERIENCE_PLAN.md.

## Additional visible component families

Illustrated empty states, accessible preference/preview switches, utility controls and the actual Embla carousel are wired into existing tasks. The carousel journey now checks the visible position, keyboard return and disabled previous control instead of inspecting native scrollLeft. The provider journey exercises the new preview switch via its keyboard interaction. Two additional checks verify saved automatic-transmission preference and illustrated empty results, plus actual decoding of the public QR SVG for both roles with exactly one generated graphic. The QR panel is closed by default, explains that drafts do not transfer, and is not presented as a payment or booking pass.

## Progressive conversation and motion release — 2026-11-11

The final local suite passes all 55 tests. Added coverage includes closed initial panels for both roles, mobile composer visibility, expandable trip editing, keyboard disclosure/confirmation behavior, actual shortlist persistence/removal and visit-only storage failure, provider identity expansion, non-billable annual plan comparison, local-brand SVG loading and animation pause/reduced-motion behavior, a painted TechText canvas, optional animation-load failure recovery, and compact vehicle-image failure/retry. Existing completed request/listing journeys additionally verify feedback appears only after explicit saves, local feedback persistence, and focus restoration when feedback closes.

TypeScript/Vite build, formatting and dependency audit pass (zero reported vulnerabilities). Optional TechText, LogoLoop, GSAP and QR bundles remain split from the landing entry. Screenshots at 375×667 and desktop were inspected, and a browser smoke journey reported zero runtime errors. The mobile dock measured about 162px versus the 231px baseline; a collapsed sample card measured about 351px versus 457px. A whole reply plus filters can still require scrolling on a small screen.

Pricing/paid features are explicitly proposals; subscription checkout and entitlements are unavailable. Feedback and saved cars are browser-local; live booking completion, remote feedback delivery, cloud draft sync and asynchronous AI search are not claimed. See UX_FEEDBACK_AUDIT.md for remaining usability work and PROVIDER_SUBSCRIPTIONS.md for the commercial/backend plan.

## 12ui Design refinement

The selected design was expanded with 12ui, integrated into existing components and compared with unchanged source LayerDocs for seven surfaces. Automatic mapping had low overlap and false semantic matches; those are documented in 12UI_UPGRADE.md rather than reported as a pixel-perfect pass. Rendered home/chooser/chat screenshots at 375, 768 and 1440px show no horizontal overflow and an available chat composer. Source image layers are served as local WebP assets, with existing illustrative/unverified labels. All 55 journey checks remain required, including failed-photo retry on the new local paths, role choice, draft persistence and inline review/save behavior.

One run during the 12ui integration hit an intermittent panel-opening assertion while optional animation requests were blocked; its cause was not established. Ten isolated repeats passed, followed by a final complete 55/55 local run. No artificial retry or timing delay was added to hide the failure.

## Scroll containment and transcript clearing — 11 November 2026

Workspace scrolling now belongs to the conversation container, with an independent composer and actual-height account bar. Reading older messages exposes Back to latest. Landing document scrolling is restored on leaving a workspace. Visual viewport resizing keeps the composer within the available viewport. Clear chat requires confirmation and preserves independent records; typing “clear chat” opens the same confirmation. Saved rental-request and provider-listing journeys exercise clear, reload and recovery of the saved record.

The brand strip has eleven local Simple Icons marks and no visible Pause button. Automatic movement, keyboard stop and static reduced-motion rendering are checked. Hover and focus also stop motion. New brand examples do not imply available inventory.

An additional WebKit 27.2 smoke check passed long-conversation scrolling at 2048×828, 768×700, 375×667 and 375×400, clear/reload and restored landing scroll, with no page errors. The document stayed at scrollY 0 with no horizontal overflow and the composer bottom within each viewport. Screenshots were inspected. This is engine-level coverage; a physical iPhone keyboard and Safari browser chrome were not tested.

For this change, all 57 Chromium journeys passed locally, including the full saved-request/listing recovery paths. TypeScript/Vite build, formatting and npm audit passed (zero vulnerabilities). The previous release’s GitHub Actions job failed before tests during browser dependency installation because Ubuntu mirrors could not resolve; it was an infrastructure failure, separate from local application validation.

## Minimalism audit — 11 November 2026

All 58 local Chromium journeys pass after replacing the marketing showcase with compact role/message entry, removing duplicated workspace navigation and making provider summary/readiness opt-in. Coverage retains every service path, typed landing handoff, saved request/listing recovery, profile/draft persistence, clear-chat preservation, vehicle review, plan previews and QR decoding. A real workspace module is held in the loading test to check the actual reduced-motion fallback; there is no product animation-preview control or artificial search delay.

Nine rendered landing/customer/provider states at 375, 768 and 1440px showed no horizontal overflow and kept the composer within the viewport. Desktop and phone screenshots were inspected and legacy feature-card minimum heights removed. WebKit long-chat checks passed 2048×828, 768×700, 375×667 and 375×400, plus clear/reload and restored landing scroll, with no page errors. Physical mobile keyboards were not tested.

Build, formatting and dependency audit passed (zero vulnerabilities). New 12ui generation/alignment remains blocked by the account’s exhausted free allowance and insufficient prepaid balance. The existing approved 12ui style remains the design basis; no new generated candidate or alignment result is claimed. See MINIMALISM_AUDIT.md.

## Per-message deletion and staged replies — 11 November 2026

Each message now has an explicit delete confirmation with an excerpt and preservation notice. The revised role transcript is saved independently of domain records. Tests exercise cancellation, focus restoration, individual deletion, all messages removed across reload, preservation of an actual saved provider listing and drafts, no resurrection of older forms, and clear-chat behavior while presentation is pending. Empty saved arrays now bypass legacy fallback. Earlier cards exposed by deletion remain archived until explicitly reopened.

Five new browser tests cover exact text/tool reveal order using the browser clock, preparation on consecutive replies, saved-history labeling, both roles’ deletion lifecycle, superseded forms and reduced motion. New output uses 320ms text pacing plus 180ms for tool entry; reduced motion uses 80ms plus 40ms without movement. This is explicitly presentation pacing for bounded demo replies, not live AI streaming or vehicle-search progress. Business saves remain immediate and independent.

The full local run covered 63 cases: 62 passed and one initial airport-journey navigation timed out. That journey passed on targeted rerun; shortlist and long-scroll regressions also passed targeted checks. The five new message tests pass. TypeScript/Vite build, formatting and dependency audit pass, with zero reported vulnerabilities. Mobile preparation/confirmation screenshots were inspected. WebKit passed viewport, scroll containment, clear/reload and landing-scroll checks at 2048×828, 768×700, 375×667 and 375×400 once the current reveal completed; no page errors were reported. A physical mobile keyboard was not tested.
