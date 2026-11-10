# MONO

Cape Town conversation-first car rental concept. React 19, TypeScript and Vite. The supplied standalone prototype was preserved and integrated, with demo logic isolated under src/demo.

## Run

```sh
npm ci
npm run dev -- --port 5173
```

Open http://localhost:5173. Book a Car opens the customer conversation; List Your Car opens the provider conversation. Requests and owner listings persist in this browser only.

## Validate

```sh
npm run build
npm test
```

Browser tests use /usr/bin/chromium when available; otherwise run `npx playwright install chromium` first.

This is a front-end demo: rule-based search, illustrative vehicles/prices, unverified availability, local-only requests, and no payments, auth, provider notifications, or publicly published storefronts. Owner sample listings stay separate from renter sample inventory. Google Fonts and vehicle images require network; the hero image is local. See DESIGN.md, ARCHITECTURE.md, and ROADMAP.md for implementation boundaries and milestones.

## Hosting and authentication

See DEPLOYMENT.md for Vercel deployment and Clerk/Supabase setup. Copy .env.example to .env.local and supply browser-safe publishable settings. Without them, the existing demo runs unchanged. Authentication and database client foundations are prepared; real booking persistence remains to be implemented.

## Chat-first workflows

Both customer and provider workspaces are conversations. Type a need or use a quick command; vehicle matches, service briefs, estimates, profile editors, listings, request history and storefront previews appear as inline assistant tool cards. The composer stays available throughout. No dashboard or separate wizard is required to complete a demo workflow.

Customer: `/#customer`. Provider: `/#provider`. Legacy links open their relevant tool inside chat. Customer/provider transcripts, incomplete drafts and saved records remain separate. New chat preserves saved business records and trip preferences.

The assistant currently uses bounded demo intent/slot handling, not a connected general-purpose LLM. The same typed card/domain contracts are intended for a future server-side model and authorized services. Read CONVERSATION_ARCHITECTURE.md and AGENTS.md before extending the product.

## UI foundation

The actual Untitled UI input primitives are vendored under src/components/base with MIT license and pinned provenance. FieldInput, FieldSelect and FieldTextarea supply consistent React Aria labeling, focus, validation, hints and disabled states, plus currency prefixes and appropriate icons. MONO's emerald tokens replace the upstream brand palette. See src/components/UPSTREAM.md.

To verify the deployed demo, run `PLAYWRIGHT_BASE_URL=https://mono-ochre-psi.vercel.app npm test`.
