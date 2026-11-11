# GOMONO fluid conversation plan

Status: proposed redesign. The small card illustration in quote review is implemented separately; the broader layout, suggestion and cloud-autosave changes below are not yet implemented.

## The product decision

The conversation should be the primary working surface. Users describe and correct their plans naturally. Private drafts save automatically. At the bottom, two or three relevant suggestions help answer the current question. Structured UI appears only when it improves a decision. Sending a request, publishing an offer and moving money remain explicit, reviewed actions.

## What the current implementation gets wrong

ChatSurface combines a large welcome grid, inline forms, a journey strip, a brief pocket, fixed command shortcuts, New chat and a demo footnote. Several compete with the current conversation. Suggestions are static navigation commands rather than replies to the next useful question. Some domain drafts already save locally, but the composer is only React state and TripEditor changes are not persisted until Update trip. Provider working drafts and saved listing records also have different meanings that the current save buttons do not explain clearly. Local persistence does not provide account-based cloud sync.

## Reference products and lessons

These are patterns to adapt, not claims that GOMONO already has these capabilities or that third-party integrations are being installed.

| Reference                                                                                                                      | Useful pattern                                                                     | GOMONO application                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ChatGPT search](https://openai.com/index/introducing-chatgpt-search/)                                                         | Follow-up questions use the conversation context                                   | Accept multiple trip details in one message; ask only for what is missing or ambiguous.                                                                                        |
| [Claude artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)                    | Substantial structured content can be inspected without replacing the conversation | Keep a brief or quote compact and expandable. Do not copy a permanently open second workspace onto mobile.                                                                     |
| [Intercom Fin](https://www.intercom.com/help/en/articles/11433030-conversational-fin-experience)                               | Focused conversational replies and clear support escalation                        | Keep responses short. Offer a real human handover when available and retain context; never display a fake available agent.                                                     |
| [Intercom quick replies](https://www.intercom.com/help/en/articles/4134615-customer-opens-a-new-conversation-in-the-messenger) | Suggested replies coexist with free text                                           | Bottom suggestions are optional, relevant answers; the composer stays usable.                                                                                                  |
| [Expedia's announced Romie concept](https://www.expedia.com/newsroom/spring-product-release-2024/)                             | An itinerary can evolve from a conversation                                        | Maintain an editable trip record behind the thread instead of repeatedly opening a form. The announcement is a design reference, not evidence of present product availability. |
| [NN/g: Less Chat, More Answer](https://www.nngroup.com/articles/less-chat-more-answer/)                                        | Task-oriented assistants should minimize unnecessary reading and interaction       | Prioritize reaching a useful option over long greetings, repeated summaries or decorative assistant chatter.                                                                   |

## Proposed interface

1. A quiet header with GOMONO, current workspace and an overflow menu. Conversation history, New conversation and switching workspace live in that menu, away from the answer suggestions.
2. A single scrolling message thread. Show a short greeting on a new conversation; the large welcome card and category grid disappear after the user starts.
3. At most one useful interactive card at a time: a date picker when requested, a short vehicle comparison, an expandable quote or a secure handoff. Earlier cards become small read-only snapshots linked to the current record.
4. Two or three contextual suggestions directly above the composer. No second permanent toolbar. Suggestions change with service, known details and task stage. They can disappear while the user is typing.
5. One expanding multiline composer. Enter sends, Shift+Enter adds a line; mobile keyboard and safe-area behavior are tested. Secure upload/payment actions appear only when relevant.
6. A discreet draft-sync indicator when its state changes. Normal successful saves do not generate assistant messages or toast notifications.

Move the permanent five-stage strip and expanded brief out of the bottom dock. A small Trip details action can open a compact inline summary on demand. Provider metrics, fleet summaries and readiness information appear when relevant to a request or explicitly asked for. Using a UI kit means using the right component at the right time, not keeping every component on screen.

## Background saving

### Automatically save

- Sent messages and unsent composer text.
- Private trip/service briefs, corrections and preferences for the current task.
- Unfinished provider listing/profile drafts, including incomplete fields.
- Current conversation/task position and relevant selected options.

### Require explicit approval

- Send a request to a provider.
- Publish a listing or update publicly visible business information.
- Accept a quote, reserve/confirm a booking, cancel a booking or approve a charge.
- Reserve, capture, refund or release funds, according to authoritative payment rules.

Remove routine Save draft buttons. Use meaningful actions such as Review listing, Send request and Continue to secure payment. Autosaved private working data and a published/sent record must be distinct states in the data model. Existing project rules requiring an explicit local draft save should be updated to reflect this user-authorized distinction when implementing this plan.

### Persistence design

Use a role-scoped draft store with explicit conversation and draft IDs. Save a recoverable local copy promptly, then debounce authenticated background sync (approximately 500 ms after editing pauses). Keep a durable outbox of pending changes and client-generated IDs for retry deduplication. Flush pending writes where possible on navigation; never depend on an unload request being delivered. Server revision checks prevent an older request from overwriting newer edits.

States are local-only, syncing, cloud-saved, waiting to reconnect and failed. Show “Saved on this device” until a server acknowledges a write; never call a local-only draft cloud-saved. A failed sync must be recoverable and visibly distinguishable. On sign-in/sign-out, isolate caches by account and role; do not silently assign a shared device's anonymous drafts to a different account. Preserve nonconflicting changes across devices and surface conflicts instead of silently discarding data.

Supabase account persistence requires the still-missing application schema, Clerk identity integration and ownership policies. Background saving in the current demo is not a substitute for those services. Long-term preferences across trips should be user-controlled, separate from remembering the current conversation.

## Conversation behavior

- Extract all usable facts from a message such as “Automatic SUV, Cape Town, three days, four people, under R900 per day.” Do not ask again for facts already provided.
- Ask the next most useful missing question, usually one at a time. Use actual dates and Cape Town pickup time in final review, resolving ambiguous phrases before a booking commitment.
- Apply corrections to the existing brief. Acknowledge a small change briefly without reprinting a complete form or full summary.
- Stream real assistant replies when the server-backed assistant exists. Show processing only during real work. Support stop/retry and avoid artificial delays.
- Preserve input focus and reading position. Auto-scroll only when the user is already near the latest message; otherwise show a New messages affordance.
- While a request is genuinely being sourced, preserve the thread and show only truthful progress. Price/availability changes invalidate obsolete quotes and require renewed review.
- Button actions are interpreted by the same typed domain commands as chat. Suggestions are filtered by current state and permissions; model text alone cannot authorize a side effect.

## Bottom suggestion examples

| Situation                      | Suggested replies/actions                        |
| ------------------------------ | ------------------------------------------------ |
| New customer conversation      | Rent a car · Book a driver · More services       |
| Transmission missing           | Automatic · Manual · Either                      |
| Dates missing                  | Choose dates · Dates are flexible                |
| Options displayed              | Lower the price · Compare options · Change dates |
| Quote ready                    | Review full quote · Change trip                  |
| New provider conversation      | Add a vehicle · Offer a service · My requests    |
| Provider draft missing pricing | Per day · Per trip · Quote on request            |
| Complete provider draft        | Review listing · Keep editing                    |

Suggestions must not silently send provider requests or initiate money movement. Any financial confirmation must identify the exact current amount and quote beside the confirm action.

## Credit card visual treatment

The attachment is documentation for the MIT Untitled UI visual card. Use one emerald style and compact sizing. Keep cards in the payment context, not the general chat, fleet metrics or welcome screen.

- Current demo: a clearly labelled illustration, masked placeholders, “No card connected,” and no network mark. It is not an issued GOMONO card or an actual saved payment method.
- Future connected checkout: display only gateway-confirmed network and last four digits. Use one compact row and an explicit change-method action. The source hardcodes Mastercard, so never let its default imply the user's network or acceptance eligibility.
- Held, paid and refunded labels come from verified server/payment events, never from clicking a button or a client callback alone.
- Actual card entry stays in gateway-owned checkout. Do not put full numbers or CVV in chat, React draft state, local storage, logs or the decorative card props.
- If payment fails, keep the trip and offer a focused retry/change-method action. Do not restart discovery.

## Implementation sequence

1. Simplify ChatSurface: one bottom suggestion row, shorter introduction, overflow conversation controls, on-demand brief, stable mobile composer and respectful scrolling.
2. Introduce a shared private draft store; autosave composer/brief/listing fields and replace redundant draft-save controls. Preserve/migrate existing local data and retain explicit send/publish/payment gates.
3. Connect Clerk identity, Supabase ownership and background sync/outbox/revision handling. Verify account separation and cross-device resumption.
4. Improve the conversation engine: structured slot updates, state-based suggestions, corrections, real streaming and domain-tool orchestration. Keep the bounded demo clearly labelled until the server-backed assistant is connected.
5. Integrate provider delivery, verified quotes/availability, Paystack and actual human support. Apply the compact card visual to verified payment metadata only.

## Acceptance checks

- The composer and relevant bottom suggestions remain visible on a small phone with the keyboard open.
- A normal turn presents no more than three suggestions, with no duplicate permanent command row.
- A message containing several facts is understood without re-asking those facts.
- Refresh, Back and workspace switching preserve drafts and unsent text; merely saving a private draft never publishes or sends it.
- Offline edits survive reconnection without duplicate messages, older overwrites or false “saved” claims.
- A user correcting dates sees the existing brief update; an expired quote cannot be paid.
- Two accounts cannot read or overwrite one another's records, including shared-device caches.
- Users can reach secure payment and real support without losing the conversation context; no payment or agent presence is simulated.

Test the design with both renters and providers using realistic tasks. Measure completion rate, time to first useful option, repeated questions, correction success and recovery from interruption. Product usability must be demonstrated with users rather than claimed from copying another product's appearance.

## Delivered interaction foundation — 2026-11-11

Trip/business context now starts closed and opens from a small header control; it retracts on explicit edit/send and Escape. Three existing role-specific shortcuts sit in the green suggestion box. Start here, new chat, profile, storefront and plan comparison live in an accessible disclosure menu. This is the shell for the proposed contextual suggestion engine; the current three shortcuts are still fixed.

Expandable trip detail tiles, a saved-business profile preview, compact vehicle product cards, an actual local shortlist, photo loading/failure recovery and optional completion feedback are visible in chat. Optional branded animation is lazy-loaded and respects reduced motion. Provider pricing is a proposed non-billable comparison, not an entitlement system. Broader composer/editor autosave, cloud sync, reading-aware scrolling and asynchronous assistant feedback remain planned. See UX_FEEDBACK_AUDIT.md for measured findings and acceptance criteria.
