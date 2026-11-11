# Conversation experience audit and delivery plan

Audit date: 2026-11-11. Scope: current React/Vite demo, desktop and a 375×667 mobile viewport, customer and provider conversations. These findings describe observed browser behavior and source paths, not a production backend audit.

## What made the experience feel heavy

| Observed baseline                                                               | Consequence                                              | Status in this release                                                                                                             |
| ------------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Bottom dock 231px at 667px height; expanded brief made it 391px                 | Too little room to read chat                             | Dock now about 162px; context starts closed; bounded optional panel; three green suggestions; overflow commands in disclosure menu |
| A sample vehicle card measured 457px in a 370px chat area                       | Primary action required scrolling past a large preview   | Compact product-style card, about 351px; extra price/verification detail expands on demand                                         |
| Blocked photo request left a broken image with no explicit recovery             | Unclear whether content was still loading                | Actual load placeholder, reserved image area, failure message and retry on comparison cards                                        |
| Local response adds user and assistant turns in one React update                | No observable processing phase                           | Still synchronous bounded demo parsing; asynchronous thinking/streaming remains planned                                            |
| Typed unsent composer text disappeared after reload                             | Lost work                                                | Still open; quiet private draft autosave is next                                                                                   |
| Unsubmitted self-drive budget edit disappeared after reload                     | Inconsistent saving expectations                         | Still open; domain draft model needs the same autosave contract                                                                    |
| Service pickup draft did survive reload                                         | Some persistence works, but the contract is inconsistent | Existing working persistence preserved                                                                                             |
| New assistant output forced scroll to latest even when reading earlier messages | Reading position lost                                    | Still open; reading-aware scroll and new-message affordance planned                                                                |
| History keeps at most 60 turns per role; no conversation archive                | Long work is hard to recover                             | Still open; separate thread/history storage planned                                                                                |

The new shortlist is a private preference, separate from booking records and provider notifications. “Saved” follows the actual storage write; a failed persistent write is labelled “Saved (visit)” and the existing session-only warning appears. Reload persistence is tested when browser storage works. This does not add cloud sync or autosave to every editor.

## Where the requested motion belongs

- TechText paints the GOMONO loading wordmark during actual workspace-code loading and the explicitly labelled loading-style preview. It does not animate quotes, change terms or impose a fake search delay. Static text remains if the chunk fails or motion is reduced.
- AnimatedContent gives the optional context panel a small entrance. Contents remain usable if its dynamic dependency fails. Reduced motion skips it.
- LogoLoop runs in the landing-page sample-brand band with Audi, BMW and Toyota SVGs, a pause control and static reduced-motion fallback. These are examples, not partnerships or verified live supply.
- The disclosure menu hides less-used commands; the compact confirmation card is limited to starting a fresh chat. Vehicle review stays inline.
- SaveToggle acknowledges a real local shortlist action. The supplied timer-only sequence was replaced; instant work stays instant.
- Expandable trip tiles show current domain values, with explicit edit-in-chat actions. The profile card shows saved provider details in the local storefront preview, without invented analytics.
- Subscription motion is a non-billable provider plan comparison. See PROVIDER_SUBSCRIPTIONS.md.
- Feedback appears after an explicit demo request/enquiry save or listing-draft save. It describes the actual completion and stores feedback locally only after submission. Real booking completion must eventually be triggered by authoritative server state, not a chat phrase or payment return URL.

## Next implementation sequence

1. **Private draft durability.** Persist unsent composer text by role/thread, retain incomplete self-drive fields separately from saved requests, and use a quiet saved/visit-only/error indicator. Restore on reload without sending. Never include raw payment/identity secrets. Production autosave requires authenticated ownership, RLS, revision/conflict handling and offline reconciliation.
2. **Truthful processing feedback.** Echo the message immediately. If a real operation lasts around 200ms, show one small contextual status such as “Preparing options” or “Checking availability” only when that task really runs. Real AI may stream concise text; stop/cancel applies only to cancellable work. No minimum fake thinking time, fabricated provider checks, fake percentages or timer-based success.
3. **Progressive information.** Keep image, name, key specifications, price basis and one next action in previews. Expand comparison, policy, provider and price breakdown on request. Extend the new photo failure contract to review/landing images; add bounded asset timeouts where appropriate.
4. **Reading and recovery.** Follow new replies only near the bottom or after the user submits. Preserve reading position otherwise and show a new-message affordance. Keep focus in the composer unless the user requests an editor. Add retry with the original input preserved and idempotency for real writes.
5. **Contextual suggestions.** Replace the current fixed three shortcuts with up to three next actions derived from the active domain state. Keep them in the existing green area. Don’t repeat the welcome grid and large cards throughout a thread.
6. **Production states and history.** Add authenticated saved threads and cloud draft sync, real source/availability timestamps, explicit error/offline states and secure payment/auth handoffs returning to the same conversation. Record feedback consent/delivery accurately, with retention/deletion rules.

## Acceptance criteria for the next phase

Reload restores an unsent message and unfinished edit without sending or booking; browser-storage failure stays explicit; background tabs and delayed replies do not steal reading position; reduced motion retains every action; slow/error/offline operations show the correct task and recovery; no availability, payment, publish or save success appears before the responsible service confirms it. Validate desktop/tablet/mobile plus keyboard and screen-reader announcements.

The local parser remains a bounded demo, not a connected general-purpose assistant. Backend search, verified inventory, Paystack transactions, provider subscriptions and real booking completion are not delivered by this visual release.
