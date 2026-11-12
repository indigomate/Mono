# GOMONO visual audit

12 November 2026. Scope: public landing page, customer conversation, provider conversation, mobile behavior and loading transition.

## Audit outcome

The product structure is already appropriately minimal. Its main weakness was visual sameness: pale surfaces, thin green borders and similarly weighted controls made the landing form, conversation messages, tool cards and status elements feel interchangeable. The page had a strong hero photograph but lost that brand intensity immediately below the fold.

This pass turns the existing 12ui emerald/ivory direction into a more distinctive midnight-mobility system while keeping every workflow and disclosure intact.

| Surface             | Finding                                                                              | Implemented direction                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero                | Strong image, but familiar left-copy/right-car composition and little branded detail | More dramatic crop and overlays, editorial section marker, route-line eyebrow, luminous primary action and an honest service taxonomy           |
| Brand strip         | Useful but visually detached from the hero                                           | Continuous midnight band, quieter marque treatment and an explicit sample count                                                                 |
| Conversation entry  | Looked like a generic white form card                                                | Dark emerald “live demo” console, stronger role state, luminous action and oversized editorial section number                                   |
| How it works        | Three equal text columns lacked narrative movement                                   | Large headline, numbered journey rail, divided steps and a stronger owner handoff                                                               |
| Footer              | Legal note ended the page abruptly                                                   | Large wordmark and balanced concept disclosure                                                                                                  |
| Workspace shell     | Ivory header and canvas had no strong entry threshold                                | Midnight header, role label, tactile workspace switch and a quiet spatial canvas                                                                |
| Welcome state       | Heading and outline buttons felt like a setup form                                   | Editorial introduction, solid conversation paths and clearer first action                                                                       |
| Messages            | User and assistant turns had weak authorship contrast                                | Pale glass assistant replies, dark emerald user replies, distinct geometry and restrained depth                                                 |
| Tools and composer  | Everything used a similar outline                                                    | Elevated tool sheets, floating composer, grouped suggestions and stronger focus states                                                          |
| Loading             | Functional but visually empty                                                        | Branded scan transition with explicit conversation context and reduced-motion fallback                                                          |
| Motion and controls | Buttons lacked tactile press feedback and the long page had no sense of progression  | React Aria action button with real hover/pressed/focus/disabled states, gloss sweep, a native scroll progress line and one-time section reveals |

## Product constraints preserved

- Customer and provider remain separate chat-first workspaces.
- The composer stays available while inline tools are open.
- Clear-chat and individual-message deletion keep saved domain records.
- Demo inventory, requests and listings remain clearly labelled and device-local.
- No live availability, payment, booking, provider delivery or verification claim was added.
- Existing keyboard, focus, touch-target and reduced-motion behavior remains available.
- Full-size landing actions now follow the same React Aria state model as the imported Untitled UI inputs, tooltip and utility controls; existing conversational actions gain matching tactile states without changing their handlers.

## 12ui generation status

The connected 12ui CLI captured the current page, but candidate generation was refused because the account’s free allowance is exhausted and the prepaid wallet has no balance. This implementation therefore extends the previously approved 12ui emerald/ivory system already present in the repository. It does not claim a new 12ui-generated candidate or pixel-aligned export.
