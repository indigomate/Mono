# Validation

## Guided-workflow release

- TypeScript validation and Vite production build pass.
- 13 Chromium tests pass: renter detail/estimate/save journey; persisted messages and trip dates; SUV/transmission/make context; duration versus currency parsing; whole-rental budget filtering; editable brief recovery; invalid dates and over-budget quotes; owner create/edit/local-preview selection; 375/768/1440px layouts; malformed and legacy data; browser Back and trip reset; Escape/focus restoration; unknown-duration/location handling; storage-failure session fallback.
- Formatting checks pass.
- Desktop and mobile workspace screenshots inspected. The landing page visual identity is preserved.
- Demo data, owner previews and requests remain browser-local. No owner notifications, real reservations, payments, public storefront publishing or identity verification are simulated.

## Release boundary

The production URL supplied by the user is https://mono-ochre-psi.vercel.app. Deployment uses GitHub/Vercel integration because the connected Vercel tool scope does not list that project. Verify the new screens on the live URL after pushing main; a successful Git push alone does not prove deployment.

The optional Clerk integration and Supabase client foundation are retained but live authentication and database persistence cannot be verified without complete provider configuration. Supabase project health was verified separately; no application schema was created by this release. External vehicle images and Google Fonts require network access. A full screen-reader/assistive-technology audit and real service integration tests remain future work.
