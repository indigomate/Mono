# MONO architecture

React 19, TypeScript and Vite remain the foundation. The cinematic landing page is preserved and conversation code loads lazily when entering a workspace.

The enduring product contract is in CONVERSATION_ARCHITECTURE.md and enforced by AGENTS.md: customer and provider workflows happen inside separate chats. Dashboards and standalone task screens are no longer active entry points.

## Active code

- src/App.tsx: landing page, hash navigation and lazy workspace loading.
- src/workspace/Workspace.tsx: customer/provider conversation dispatcher.
- src/workspace/WorkspaceShell.tsx: role identity, conversation-only navigation and conversational role chooser.
- src/conversation/ChatSurface.tsx: transcript, inline tools, quick commands, new-chat confirmation and persistent composer.
- src/conversation/model.ts: typed tool/turn descriptors, transcript validation and recovery.
- src/conversation/CustomerConversation.tsx: customer intent/slot handling, trips, service briefs, estimates and request tools.
- src/conversation/ProviderConversation.tsx: provider intent handling, profile/listing drafts, fleet, preview and inbox tools.
- src/conversation/ProviderCards.tsx and VehicleCards.tsx: typed inline presentation and review actions.
- src/components/base: pinned MIT-licensed Untitled UI input primitives built on React Aria and Tailwind.
- src/components/ui: MONO field adapters; domain handlers do not depend on upstream component implementation details.
- src/demo: sample inventory, typed domain records, matching, service taxonomy and guarded browser persistence.
- src/auth and src/services: optional Clerk identity and Supabase client foundations; not used to present demo changes as live transactions.

Earlier dashboard components remain available as reference but are not imported by the active workspace dispatcher. Reusable TripEditor, ServiceEnquiry and VehicleReview are rendered as inline tools. VehicleReview retains legacy modal compatibility for inactive callers; the active customer conversation always uses its inline mode.

## Domain and trust

Service type, vehicle category and provider identity are independent. Budget mode is explicit, and whole-rental matching uses actual dates or a duration. Estimate review only calculates base rental and blocks invalid dates/over-budget saves. Service target budgets are not quotes. No availability, fees, deposits or provider verification are invented.

All business records remain demo-only browser data. Existing storage keys and records are preserved; versioned role transcripts and unfinished drafts are separate. React escapes user strings. Typed tools select known renderers and identifiers. Browser storage is not an authorization boundary; live services must enforce Clerk actor identity and Supabase ownership policies server-side.

## Integration boundary

The MONO Supabase project exists, but no application tables or RLS migrations were added by this UI release. Authentication, availability, payments, notifications and public publishing must be connected through the typed domain/tool layer described in CONVERSATION_ARCHITECTURE.md. No service credentials are exposed in client code.

## Validation and delivery

npm run build performs TypeScript checking and Vite bundling. npm test covers whole conversation journeys in Chromium; PLAYWRIGHT_BASE_URL runs the same suite against the deployed demo. npm run format:check verifies source formatting. GitHub main deploys through Vercel to https://mono-ochre-psi.vercel.app.

### Visible experience state

`JourneyContext` reads existing customer domain state and typed tool context; it does not infer bookings from assistant prose. The latest service/vehicle/trip/service-choice tool establishes the active brief. `ProviderContext` reads saved provider records and the independent unfinished listing draft. Both are optional ChatSurface context slots beside the always-available composer. Welcome, readiness and comparison actions call the existing conversation handlers.

`RequestRecord` presents local requests without trusting arbitrary legacy status text as a booking confirmation. Service history review creates an editable copy and preserves the original record. `PaymentChoices` is an explanatory, unavailable state: it persists no financial election and moves no money. Future quote/booking integrations must replace it with server-authorized prices, option eligibility, accepted terms, payment state and confirmed fulfilment details. A local request or viewed quote cannot advance the journey to paid or confirmed.
