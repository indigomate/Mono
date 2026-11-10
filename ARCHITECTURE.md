# Technical architecture

## Audit and decision

The supplied source comprised README.md and a 22KB standalone index.html. There was no package manifest, React source, TypeScript configuration, Vite setup, lockfile, tests, or asset directory. The HTML contained working renter chat, rule-based inventory matching, request forms, owner vehicle entry, storefront preview, and localStorage persistence. The referenced hero asset was absent, mobile sidebar navigation was hidden, dynamic form labels were unassociated, and unchecked JSON parsing could stop startup.

A small React 19 / TypeScript / Vite shell now preserves that implementation. The uploaded README's proposed Next.js migration was not adopted: the user's requested Vite foundation takes precedence. Clerk and Supabase SDKs are installed as integration foundations. Live services are not configured; no LLM or payment SDK is installed.

## Structure

- index.html: entry point, language, metadata, and React mount.
- src/main.tsx: React bootstrapping.
- src/App.tsx: typed React layout and initial event bindings.
- src/styles.css: preserved original styling plus emerald and responsive refinements.
- src/demo/inventory.js: illustrative Cape Town inventory.
- src/demo/storage.js: guarded browser-only persistence, shape checks, and session-only fallback notice.
- src/demo/experience.js: compatibility controller for the original DOM interactions, scoped delegated events for generated forms/cards, and hash-based initial view routing.
- public/assets/cape-town-car.jpg: local landing photograph from Unsplash.
- tests: Chromium integration and responsive checks.

React owns the static layout; the compatibility controller owns generated conversation and panel descendants. React does not re-render those descendants. This intentionally bounded bridge minimizes regression risk; do not add competing React state to the same nodes. JavaScript compatibility modules are included by TypeScript but not checked with checkJs. Migrate them to typed React components feature by feature before increasing state complexity. The controller unregisters event listeners on unmount.

## Demo boundary

All inventory, matching, requests, listing data, and persistence live under src/demo. Browser keys mono-city, mono-requests, and mono-listings are retained for existing users. No data is sent to providers. Do not enter sensitive real data into this demo. Storage is untrusted: values are parsed defensively and user-facing strings are escaped. Storage failures leave the session usable but cannot provide durable saves. Owner listings are showcased in the storefront; they deliberately do not become verified renter inventory.

## Future service contracts

Introduce server-authorized InventoryService.search(criteria), AvailabilityService.quote/dates, BookingService.hold/request, OwnerService.listings/verification, and NotificationService subscriptions. Keep demo implementations explicitly selected and never silently fall back to sample availability in production. Use server-side authorization and schema validation, atomic date-overlap prevention and expiring holds, idempotent payment/booking mutations, signed webhook verification, audit logs, and explicit confirmation before money movement.

The concierge should call typed server tools; the model must never be the authority for availability, price, identity, or payment status. Public SEO storefront rendering can be added as a separately evaluated milestone; Vite alone does not server-render SEO pages. No architectural migration is required for this prototype repair.

## Runtime

npm ci; npm run dev -- --port 5173. npm run build performs TypeScript validation and Vite bundling. npm test runs Playwright against a managed local Vite server. The dev server binds all interfaces for cloud preview access; it is not a production server. Google Fonts and inventory Unsplash images still require network access.

## Deployment and identity foundation

See DEPLOYMENT.md for GitHub, Vercel, Clerk, and Supabase configuration. src/auth/Authentication.tsx enables Clerk only when configured. src/services supplies a separate authenticated Supabase client factory; it is not used by the demo controller. Native Clerk session tokens are used, without deprecated JWT templates. No hosted database schema has been changed.
