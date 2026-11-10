# MONO

Cape Town conversation-first car rental concept. React 19, TypeScript and Vite. The supplied standalone prototype was preserved and integrated, with demo logic isolated under src/demo.

## Run

```sh
npm ci
npm run dev -- --port 5173
```

Open http://localhost:5173. Book a Car opens the customer dashboard; List Your Car opens Provider Studio. Requests and owner listings persist in this browser only.

## Validate

```sh
npm run build
npm test
```

Browser tests use /usr/bin/chromium when available; otherwise run `npx playwright install chromium` first.

This is a front-end demo: rule-based search, illustrative vehicles/prices, unverified availability, local-only requests, and no payments, auth, provider notifications, or publicly published storefronts. Owner sample listings stay separate from renter sample inventory. Google Fonts and vehicle images require network; the hero image is local. See DESIGN.md, ARCHITECTURE.md, and ROADMAP.md for implementation boundaries and milestones.

## Hosting and authentication

See DEPLOYMENT.md for Vercel deployment and Clerk/Supabase setup. Copy .env.example to .env.local and supply browser-safe publishable settings. Without them, the existing demo runs unchanged. Authentication and database client foundations are prepared; real booking persistence remains to be implemented.

## Guided workflows

The Rent & Ride customer dashboard offers eight service journeys. Self-drive opens a resumable conversation and editable trip summary. View a car, choose dates, review the base rental estimate, acknowledge demo status and save a local request. Provider Studio separately manages provider identity, service offerings, vehicle drafts, pricing units and the local storefront preview. Existing browser-local records are migrated; no live marketplace data is sent or confirmed.

To verify the same journeys against the deployed demo, run `PLAYWRIGHT_BASE_URL=https://mono-ochre-psi.vercel.app npm test`. Tests use browser-local demonstration records.

## Separate workspaces

- Customer dashboard: `/#customer` — self-drive, chauffeur, airport, weddings/events, groups, tours, long-term/subscriptions and custom enquiries.
- Provider Studio: `/#provider` — overview, provider profile, vehicles/services, incoming requests and storefront preview.
- `/#workspaces` explicitly changes workspace; customer navigation never includes provider controls and vice versa. Legacy `/#chat`, `/#owner`, `/#bookings` and `/#store` routes remain supported.

Provider type (private owner, fleet business, chauffeur operator or mixed) is independent of offered service types and vehicle categories. Service enquiries are quoted by a provider; daily self-drive estimates are not reused for chauffeur, transfer or subscription pricing. Driver arrangement, routes, dates and service-specific fields are saved in the customer brief.

These are separate demo experiences, not authenticated role authorization. Customer requests are not delivered to the provider inbox. Live Clerk roles, server authorization, Supabase ownership policies and provider delivery must be implemented before production use.
