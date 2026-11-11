# 12ui Design UI upgrade

Date: 2026-11-11. Scope: the existing React/TypeScript/Vite application, preserving all customer/provider conversation handlers and local records.

## Design process and selected sources

Used the 12ui Design skill and CLI 0.2.134, connected to the user's 12ui account. Generated four landing directions from the live application, inspected the PNGs and explicitly selected **A**. Root improve run `crt-24369736fcd7567a085d1545b24c4de093e968eb`; selected conversion `b71797ef-efd0-4425-bc8c-3bf813938e85`.

Expanded that selection with a complete site branch, `crt-324e3538600bc50450e125f9aa8e77cd8714d360`. Its permanent split-pane chat layouts conflicted with the product contract, so they were rejected. Its role-chooser visual is used with the existing role-selection behavior; chooser source conversion `74472924-6f93-43ea-ad6a-7b07f2da4e08`.

Generated four corrected ivory chat directions, inspected all four and selected **B** from draft `crt-2e4d39031102e02d2df2646edbe8a8ff8f7c25c7`. The corrected app branch `crt-3c25e4f3a46f86d199d1dddbe3da6420f399e580` produced five complete states and a clickable prototype. Its exported shell, surfaces, type, control borders, spacing and imagery inform the existing React implementation.

| Target state                         | Original viewport conversion           |
| ------------------------------------ | -------------------------------------- |
| Customer chat/comparison, selected B | `8dcf324d-7401-45a2-9694-230c82f9d114` |
| Provider welcome                     | `49603b3c-5e77-438b-aaa6-577c785f85aa` |
| Provider form                        | `937e3d35-bc78-41e6-ab37-abe301d99d14` |
| Trip form                            | `4ee6cebe-9a5e-4b36-a508-5270081fe540` |
| Proposed plans                       | `cf9ed6b5-6324-42df-97a9-7cef42ec7a87` |

Both branch exports completed. Their prototypes were inspected as references, not deployed as a replacement application. The current hash routing and typed conversation tools remain the interaction baseline because retaining them is an explicit user requirement. No generated modal vehicle flow or extra dashboard route was adopted.

## Delivered visual system

- Cinematic full-width Cape Town hero with extracted scene imagery, Inter display type, cleaner action spacing and mint emphasis.
- Coordinated landing preview, sample-brand loop, explanatory cards and footer; all existing entry actions and demo controls remain.
- Narrow emerald navigation rail, light header, ivory conversation canvas, pale assistant bubbles and white inline tool surfaces.
- More compact welcome choices on mobile, collapsed context, three green suggestions and a rounded persistent composer.
- Refined field labels, calendar surfaces, comparison cards, estimates, empty states, saved-car control, provider identity, plan selector and feedback cards.
- More informative customer/provider choices with their existing accessible names and navigation behavior.

Typography, surfaces and repeated controls are consolidated in `src/styles/12ui-tokens.css` and `12ui-refinement.css`. Removed 33 historical landing `!important` declarations that prevented the new layout from rendering; reduced-motion overrides remain. No runtime framework or business-service dependencies were added.

## Assets and boundaries

`public/design/gomono-hero.webp` comes from the root clean-plate export. That plate already includes the car; placing its separate car cutout again would duplicate the vehicle, so the redundant cutout is retained only in the design kit. `gomono-chooser.webp` comes from the exported chooser hero layer. `toyota-corolla.webp` and `bmw-3-series.webp` come from the selected corrected chat export’s individual photo layers. These are illustrative generated visuals, not verified vehicle photographs. Existing sample names, IDs, rates and availability disclaimers are retained; specifically the generated BMW R950 rate is not adopted over the real demo rate.

The root design's six generated brand marks were not shipped: the existing licensed Audi/BMW/Toyota SVG loop remains, with sample-brand and availability notices. The generated static chat screenshot was not substituted for the working interactive preview. Provider illustrations, extra menu icons, photo-upload actions, fictional business/contact details, invented listing limits and “Most popular” claims were not added. The actual approved proposal remains 2/10/50 listings and 12/10/8% commissions. These deviations preserve the user's functionality and truthful-content requirements.

Original PNGs, raster layers, prototypes and unchanged targets remain in `/workspace/work/gomono-12ui-upgrade`, `gomono-12ui-site`, `gomono-12ui-chat` and `gomono-12ui-targets`. Served images were converted to WebP at the same dimensions: about 316KB total instead of 4.8MB. No raw full-screen design image is served as a UI.

## Alignment and validation

Ran `12ui improve` against the implemented local URL and each state's original unchanged LayerDoc target for home, customer, provider, profile, trip, plans and chooser. Kits are under `/workspace/work/gomono-12ui-align-*`. Reviewed and applied safe typography, border and badge findings. The matcher reported low DOM overlap (about 5–40%) and some false bindings, including calendar cells to budget labels. Those semantic rewrites were rejected. This is a functional integration of the selected design system, not a claim of pixel-identical replacement of every mockup.

Inspected rendered home, chat and chooser at 375, 768 and 1440px: no horizontal overflow and the chat composer remains in view. The chooser retains its scrollable container on short screens. All 55 conversation browser tests pass; the photo-failure test covers the new local image paths. Build, formatting and dependency audit pass. Local sample persistence, separate customer/provider histories, inline estimates, review/save gates and unavailable live billing are preserved.
