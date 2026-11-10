# MONO project rules

MONO is a chat-first mobility marketplace. Preserve the React, TypeScript and Vite foundation and cinematic emerald landing page.

## Product architecture

- The customer and provider workspaces are separate conversations, not dashboards. Use ChatSurface and typed tools in src/conversation.
- Every customer/provider operation starts or continues in conversation. Render service choices, vehicle comparisons, dates, estimates, profile editors, listings, request history, inbox and storefront previews as inline assistant tool cards. Do not add dashboard-first entry pages or route-based multi-page wizards unless the user explicitly changes this requirement.
- Keep the composer available while a tool is open. Do not turn vehicle review into a modal or move a user to another page to finish a workflow. Secure vendor authentication/payment handoffs may be initiated from a conversation and must return to the same context.
- Quick actions are chat commands, not navigation to disconnected screens. Earlier tool cards reopen a current tool in the conversation. Keep customer/provider transcripts and domain state separated.
- Service type, vehicle category and provider type are independent concepts. Preserve all service paths and the custom enquiry fallback. Ask for clarification instead of inventing inventory, availability, a quote or a successful action.

## UI components

Use FieldInput, FieldSelect and FieldTextarea from src/components/ui for form fields. They adapt the actual Untitled UI React/React Aria/Tailwind primitives under src/components/base. Retain upstream license and provenance. See src/components/UPSTREAM.md. Use the shared MONO semantic tokens, labels, help/error states, disabled/read-only states and currency prefixes rather than styling another ad hoc field family. Native checkboxes and secure vendor-owned controls are allowed where appropriate.

## Domain and integration boundaries

Keep business records and incomplete form drafts outside transcript text. Demo persistence is isolated under src/demo. A typed chat tool identifies which domain operation/card to use; it is not a permission grant. Live Supabase operations must enforce Clerk identity, provider ownership, input validation and authoritative booking/availability rules server-side. Never expose secrets in VITE_ variables. Never silently substitute demo availability for a failed production service.

Saving a local request/listing/profile requires an explicit review action. Publishing, sending to providers, booking confirmation and money movement require real connected services and explicit confirmation; never simulate their success. The current assistant uses bounded demo intent/slot handling, not a connected general-purpose LLM.

## Validation

Run npm run build, npm test and npm run format:check. Tests must cover the whole conversation journey, role separation, draft persistence and mobile composer visibility. The same browser suite can run against the deployed demo using PLAYWRIGHT_BASE_URL. See CONVERSATION_ARCHITECTURE.md for the enduring design contract.
