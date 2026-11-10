# Validation

## Separate-workspace release

- TypeScript validation and Vite production build pass.
- 29 Chromium tests pass: renter detail/estimate/save journey; persisted messages and trip dates; SUV/transmission/make context; duration versus currency parsing; whole-rental budget filtering; editable brief recovery; invalid dates and over-budget quotes; owner create/edit/local-preview selection; 375/768/1440px layouts; malformed and legacy data; browser Back and trip reset; Escape/focus restoration; unknown-duration/location handling; storage-failure session fallback.
- Added coverage includes distinct customer/provider navigation, all seven non-self-drive enquiry forms, enquiry draft resumption, customer/provider inbox separation, provider profile and hourly rates, explicit chauffeur-intent routing, unsupported-vehicle custom briefs, quote-only listing persistence, and both dashboards/forms at 375/768/1440px.
- Formatting checks pass.
- Desktop and mobile workspace screenshots inspected. The landing page visual identity is preserved.
- Demo data, owner previews and requests remain browser-local. No owner notifications, real reservations, payments, public storefront publishing or identity verification are simulated.

## Release boundary

The production URL supplied by the user is https://mono-ochre-psi.vercel.app. Deployment uses GitHub/Vercel integration because the connected Vercel tool scope does not list that project. Verify the new screens on the live URL after pushing main; a successful Git push alone does not prove deployment.

The optional Clerk integration and Supabase client foundation are retained but live authentication and database persistence cannot be verified without complete provider configuration. Supabase project health was verified separately; no application schema was created by this release. External vehicle images and Google Fonts require network access. A full screen-reader/assistive-technology audit and real service integration tests remain future work.

## Product scope

Rent & Ride and Provider Studio are separate frontend experiences with independent state ownership and role-specific menus. They share presentation and an explicit workspace switch, not a mixed dashboard. Existing self-drive requests and owner listings migrate without deletion. Customer rental requests, service enquiries, provider profile and listing drafts remain browser-local; provider inbox delivery, authenticated roles and production ownership enforcement remain unimplemented. This release does not claim live availability for newly added service or vehicle categories.
