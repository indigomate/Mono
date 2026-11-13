# GOMONO architecture

React 19, TypeScript and Vite remain the foundation. The cinematic landing page is preserved and conversation code loads lazily when entering a workspace.

The enduring product contract is in CONVERSATION_ARCHITECTURE.md and enforced by AGENTS.md: customer and provider workflows happen inside separate chats. Dashboards and standalone task screens are no longer active entry points.

## Active code

- src/App.tsx: landing page, hash navigation and lazy workspace loading.
- src/workspace/Workspace.tsx: customer/provider conversation dispatcher.
- src/workspace/WorkspaceShell.tsx: role identity, conversation-only navigation and conversational role chooser.
- src/conversation/ChatSurface.tsx: transcript, inline tools, quick commands, new-chat confirmation and persistent composer.
- src/conversation/model.ts: typed tool/turn descriptors, transcript validation and recovery.
- src/conversation/CustomerConversation.tsx: customer intent/slot handling, trips, service briefs, estimates and request tools.
- src/conversation/ProviderConversation.tsx: provider intent handling, profile/listing drafts, activation handoff, fleet, preview and inbox tools.
- src/conversation/providerReadiness.ts: pure seven-stage provider/listing readiness rules shared by the active editor and fleet summaries.
- src/conversation/ProviderCards.tsx and VehicleCards.tsx: typed inline presentation and review actions.
- src/components/base: pinned MIT-licensed Untitled UI input primitives built on React Aria and Tailwind.
- src/components/ui: GOMONO field adapters; domain handlers do not depend on upstream component implementation details.
- src/demo: sample inventory, typed domain records, matching, service taxonomy and guarded browser persistence.
- src/auth and src/services: optional Clerk identity and Supabase client foundations; not used to present demo changes as live transactions.

Earlier dashboard components remain available as reference but are not imported by the active workspace dispatcher. Reusable TripEditor, ServiceEnquiry and VehicleReview are rendered as inline tools. VehicleReview retains legacy modal compatibility for inactive callers; the active customer conversation always uses its inline mode.

## Domain and trust

Service type, vehicle category and provider identity are independent. Budget mode is explicit, and whole-rental matching uses actual dates or a duration. Estimate review only calculates base rental and blocks invalid dates/over-budget saves. Service target budgets are not quotes. No availability, fees, deposits or provider verification are invented.

All business records remain demo-only browser data. Existing storage keys and records are preserved; versioned role transcripts and unfinished drafts are separate. React escapes user strings. Typed tools select known renderers and identifiers. Browser storage is not an authorization boundary; live services must enforce Clerk actor identity and Supabase ownership policies server-side.

## Integration boundary

The GOMONO Supabase project exists, but no application tables or RLS migrations were added by this UI release. Authentication, availability, payments, notifications and public publishing must be connected through the typed domain/tool layer described in CONVERSATION_ARCHITECTURE.md. No service credentials are exposed in client code.

## Validation and delivery

npm run build performs TypeScript checking and Vite bundling. npm test covers whole conversation journeys in Chromium; PLAYWRIGHT_BASE_URL runs the same suite against the deployed demo. npm run format:check verifies source formatting. GitHub main deploys through Vercel to https://mono-ochre-psi.vercel.app.

### Visible experience state

`JourneyContext` reads existing customer domain state and typed tool context; it does not infer bookings from assistant prose. The latest service/vehicle/trip/service-choice tool establishes the active brief. `ProviderContext` reads saved provider records and the independent unfinished listing draft. Both are optional ChatSurface context slots beside the always-available composer. Welcome, readiness and comparison actions call the existing conversation handlers.

Provider listing activation is structured domain state, not transcript text. `Draft.activation` stores prepared vehicle metadata, filename-only upload selections, operating rules and review acknowledgement. `providerReadiness` derives completion; no persisted progress number can drift from the underlying fields. The demo may mark a draft `ready` only for a future secure verification handoff. It never marks verification submitted, approved, paid or published. Production file contents belong in private object storage, and Paystack beneficiary setup must stay in a hosted secure handoff.

`RequestRecord` presents local requests without trusting arbitrary legacy status text as a booking confirmation. Service history review creates an editable copy and preserves the original record. `PaymentChoices` is an explanatory, unavailable state: it persists no financial election and moves no money. Future quote/booking integrations must replace it with server-authorized prices, option eligibility, accepted terms, payment state and confirmed fulfilment details. A local request or viewed quote cannot advance the journey to paid or confirmed.

### Landing-to-conversation entry

App holds an optional transient role/text entry from an explicit landing action or form submission. Workspace passes it only to the matching role; the conversation consumes it using its existing command handler and acknowledges consumption back to App. It is not a new stored transcript format or an authorization boundary. Existing history is appended to, never replaced. Reload resumes the resulting transcript without resubmitting the entry. ProductPreview reads current local listing counts when returning to the landing page and never reads customer records into the provider preview.

## Optional interaction layer

ChatSurface owns only ephemeral panel/menu/composer presentation; typed customer/provider tools still own operations. New `shortlist` and `plans` tool types survive transcript validation. Shortlist IDs use versioned demo storage independently of request records. Storage writes return actual device/session persistence status without breaking existing callers. Provider plan definitions are isolated proposal data; comparison state grants no entitlement.

Completion IDs attach optional feedback to an explicit local save. Feedback is role-scoped browser data, not an API submission. Live booking-completion feedback must originate from an authoritative booking event. Product imagery has isolated loading/error/retry presentation and leaves metadata/actions intact. Animation modules load only on demand and do not gate the business flow.

Production subscription/commission architecture and launch sequencing are specified in PROVIDER_SUBSCRIPTIONS.md. Private draft sync, conversational processing and reading-position improvements remain future work described in UX_FEEDBACK_AUDIT.md.

## 12ui design integration

12ui is a design-time tool installed outside the app, not a new runtime dependency. Generated HTML/prototype outputs supplied visual references and extracted image layers. The application still runs the same React components, hash routing, typed chat tools and demo persistence. New token/refinement styles load through main.tsx; the legacy landing override priorities were relaxed so this layer can own presentation. No generated prototype routing, checkout, verification, uploads or mocked business records replaced domain behavior. See 12UI_UPGRADE.md.

## Workspace viewport and transcript clearing

`useWorkspaceViewport` bounds workspace routes to the visual viewport, including keyboard resizing, while the marketing page retains native document scrolling. A flex chain accounts for the actual authentication bar height. The transcript owns its scroll; opening a turn scrolls this container rather than calling `scrollIntoView` on the page. Readers can return with Back to latest.

Clear chat confirms before replacing only the active role transcript. Domain records, preferences, shortlist, provider drafts and the other role transcript remain separate and unchanged. Persistence is local demo storage, not server backup or account synchronization.

## Minimal entry and shell

`ProductPreview` now provides only role selection, typed conversation handoff and optional QR entry; its historical name remains to avoid unnecessary routing churn. It no longer loads sample inventory, progress previews or local provider metrics. `WorkspaceShell` exposes one header rather than duplicated sidebar/mobile navigation. `ChatSurface` owns a welcome disclosure independent of business records. Business overview remains a typed provider tool available through chat and its action menu. A legacy single welcome turn with an automatically injected summary is normalized without changing its text or domain records. Multi-turn history is retained.

## Per-message controls

`ChatSurface` exposes a message deletion callback for each role, with a shared confirmation modal, excerpt and focus restoration. `deleteTurn` preserves transcript order and marks newly exposed older tools as archived. Both role containers save only their own revised transcript; domain state is untouched. The transcript loader recognizes an empty saved array as intentional.

`useReplySequence` owns cancellable text/tool reveal timers and reduced-motion behavior. It never delays domain saves or invents service progress. Existing loaded history bypasses replay; new output uses a brief preparation indicator and staged card reveal. Reading-aware container scrolling follows each reveal without moving the outer page.
