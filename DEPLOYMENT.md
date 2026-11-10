# GitHub, Vercel, Clerk and Supabase

## Status and boundaries

This repository retains the working demo. The Clerk account bar is enabled only when its public key is configured. The authenticated Supabase client factory is prepared separately from the demo controller. Configuring keys does **not** turn local demo requests into live bookings or publish owner listings. Production persistence, database schema and RLS policies must be implemented and verified against the selected MONO database before enabling production screens.

## GitHub

Source is pushed to https://github.com/indigomate/Mono on main. The user-created repository is public. Environment files and credentials are excluded. The GitHub Actions workflow validates build, formatting, and Chromium journeys on pushes and pull requests.

## Vercel

Import the GitHub repository into Vercel. Use the repository root, Vite framework, npm run build, and dist output directory. vercel.json defines the build, SPA routing, and basic response headers. Vercel should provide preview deployments for branches and a production URL for main. Deployment has not happened until Vercel confirms a ready deployment URL. The localhost development URL is only reachable inside the cloud workspace.

Deploying with all three optional variables unset runs the demo. Enable deployment protection for previews where appropriate. This is a static Vite app; hash workspace routes remain client-side, not SEO storefronts.

## Clerk authentication

Create/select a Clerk application and add its publishable key as VITE_CLERK_PUBLISHABLE_KEY in Vercel and .env.local. Set allowed origins/domains in Clerk for localhost, the chosen preview URLs, and the final domain. Add and verify the production domain before using production credentials. A configured Clerk app enables the real sign-in modal and user menu; it does not authorize browser-local demo data.

No Clerk secret key is needed in this static frontend. Configure future server secrets only in server-side environment variables.

## Supabase + Clerk

Create/select the dedicated MONO Supabase project. In Clerk, enable the native Supabase integration at https://dashboard.clerk.com/setup/supabase. Register Clerk as a Third-Party Auth provider in Supabase with the corresponding Clerk domain. Use native Clerk session tokens with the authenticated role, not deprecated Supabase JWT templates.

Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY from the selected project's public API configuration. The client uses Clerk getToken through Supabase's accessToken option. Never expose a service-role key, secret key, or database password in VITE_ variables or Git.

Before production persistence, create versioned migrations with ownership policies based on the Clerk JWT subject (a text user ID, not auth.uid()'s UUID assumption), enable RLS on all exposed tables, and test cross-user access rejection. Do not make the Clerk subject a foreign key to auth.users: Clerk owns user identities. Public discovery must expose only verified, approved inventory. Quotes, holds, payments and booking confirmation require server-controlled operations and concurrency guarantees.

## Required smoke checks after configuration

1. Open the Vercel deployment on a separate device and verify landing images and both CTAs.
2. Sign in/out through Clerk, reload, and check session handling.
3. Verify Supabase accepts Clerk session tokens; test unauthorized and cross-user queries before connecting production screens.
4. Confirm errors never silently fall back to sample availability or claim a confirmed booking.

## Selected Supabase project

MONO was created in QuattroCape in eu-west-1 (Ireland). Project reference: vgotgieufkctvhtgsdnt. Dashboard: https://supabase.com/dashboard/project/vgotgieufkctvhtgsdnt. Its database health query succeeded. The public URL and publishable key are saved in the ignored local environment file; they have not been configured in Vercel. Clerk registration, RLS/schema migrations, and live persistence are pending. No database tables have been created by this repository.

## Vercel access status

The user imported the repository into Vercel and supplied https://mono-ochre-psi.vercel.app as the live application URL. The connected Vercel tool scope does not list this project and previously denied project creation. Releases therefore use the repository Git integration; verify the live URL after every release.
