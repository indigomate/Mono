# Technical architecture

MONO is a React 19 / TypeScript / Vite frontend. The supplied standalone HTML prototype established the visual identity and initial demonstration flows; the active workspace now uses typed React state. No framework migration was introduced.

## Active components

- `src/App.tsx`: preserved cinematic landing page, hash routing and browser Back support.
- `src/workspace/Workspace.tsx`: route dispatcher mounting either the customer or provider workspace.
- `src/workspace/WorkspaceShell.tsx`: shared presentation with distinct role-specific menus and an explicit workspace chooser.
- `src/workspace/CustomerWorkspace.tsx`: owns the renter journey, self-drive requests and service enquiries only.
- `src/workspace/CustomerDashboard.tsx`: eight service entry points and customer activity.
- `src/workspace/ServiceEnquiry.tsx`: service-specific briefs and customer enquiry history.
- `src/workspace/ProviderWorkspace.tsx`: owns provider profile and listing drafts only, plus a separate overview, incoming inbox placeholder and local storefront.
- `src/workspace/ProviderProfile.tsx`: provider type, service area and offered services.
- `src/workspace/VehicleServiceEditor.tsx`: vehicle category, multiple service types, capacity and reference-rate units.
- `src/workspace/TripEditor.tsx`: labeled controls for dates, duration, budget mode, category, make, vehicle class, transmission and passengers.
- `src/workspace/VehicleReview.tsx`: accessible native modal for vehicle details, date selection, base-rental review and explicit demo acknowledgement. Escape closes the modal and restores focus.
- `src/workspace/OwnerWorkspace.tsx`: provider-only listing management and local-preview selection.
- `src/demo/marketplace.ts`: typed demo models, bounded preference extraction, deterministic matching, currency formatting and record migration.
- `src/demo/inventory.js`: illustrative renter inventory; specifications and photographs are not verified vehicle representations.
- `src/demo/storage.js`: guarded browser persistence with a session-memory fallback and visible storage warning.
- `src/auth/Authentication.tsx`: optional Clerk account controls, enabled only with a publishable key.
- `src/services`: separate Clerk-token Supabase client foundation, not used by demo persistence.
- `src/demo/experience.js`: original DOM controller retained for reference, no longer imported or bundled in the active application.

## State and persistence

React owns all active workspace nodes; generated HTML and direct DOM mutation are no longer used for the renter/owner screens. A versioned `mono-journey-v1` browser record saves structured trip preferences, search state and up to 40 messages. `mono-requests` and `mono-listings` retain their original keys. Legacy owner listings receive stable IDs and become editable drafts. New owner listings never enter renter inventory automatically.

Daily and whole-rental budgets are distinct. Whole-rental comparisons require dates or a duration. Actual dates determine the estimate when supplied. A changed quote that exceeds the saved budget cannot be saved until the trip is revised. The UI calculates base rental only; fees, deposits, insurance terms, availability and payment status are not invented.

Request timelines describe local draft completion. They do not simulate owner acceptance or booking confirmation. Storefront selection changes only a local preview flag and does not publish a public listing. Browser persistence is untrusted: records are parsed defensively and rendered through React's string escaping. Storage failures preserve progress in memory until reload and display a warning. Do not enter sensitive real data into the demo.

## Production boundary

The dedicated MONO Supabase project exists in QuattroCape (eu-west-1), but no application tables or RLS migrations have been applied. Live owner identity, verification, availability, notification delivery, booking state transitions and payments remain unimplemented. Clerk sign-in alone does not authorize or synchronize the demo records.

Introduce typed Inventory, Availability, Booking, Owner and Notification service implementations behind explicit production screens. Use server authorization, schema validation, ownership policies based on the Clerk JWT text subject, verified published inventory, atomic date-overlap prevention and expiring holds, idempotent payment/booking operations, verified webhooks and audit trails. The concierge must use authoritative service results; it cannot decide availability, price or payment state itself. Never silently substitute demonstration inventory after a production service failure.

## Delivery and verification

`npm ci` installs locked dependencies. `npm run build` checks TypeScript and builds Vite output. `npm test` exercises browser journeys in Chromium. `npm run format:check` verifies formatting. GitHub Actions runs these checks. Vercel imports the GitHub main branch with the Vite framework, `npm run build` and `dist`; see DEPLOYMENT.md for identity and environment setup. Public SEO storefront rendering remains a separate future milestone.

The landing hero image is local; vehicle images and Google Fonts still require network access. Native dialogs, keyboard focus, active mobile navigation, and responsive layouts have browser coverage; a full assistive-technology audit remains future work.

## Service taxonomy and workspace boundaries

`src/demo/services.ts` defines service types independently of vehicle categories and provider identity. Services are self-drive, chauffeur, airport, events, group transport, tours, long-term/subscriptions and custom enquiries. Vehicle categories include cars, SUVs, luxury/exotic, vans/minibuses, bakkies, motorcycles, campers, trucks and other vehicles. A custom brief covers requirements beyond sample inventory without inventing supply.

Service enquiries use their own `mono-service-inquiries-v1` records and per-service resumable draft keys. They collect driver arrangement, route, date/time or rental end date, passengers, driver hours where applicable, target total budget and notes. They do not create numeric quotes. Provider profile uses `mono-provider-profile-v1`; listings extend the existing `mono-listings` record with services, vehicle category and day/hour/trip/month/quote rate basis. Legacy listings migrate to self-drive/day. Customers' drafts never appear as live incoming provider requests.

The workspace split is a frontend/product boundary, not an authentication or authorization claim. Both remain usable as demos through an explicit switch. Production must authorize customer and provider roles server-side and restrict each provider inbox to addressed requests under Supabase policies. Neither route visibility nor Clerk UI alone is a security boundary.
