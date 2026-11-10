# Untitled UI input foundation

Source: https://github.com/untitleduico/react
Pinned commit: 207c26b47595bf39d9467265055623e1c7082294
License: MIT; see UNTITLED-UI-LICENSE.txt.

Vendored components: Input/InputBase/TextField, InputGroup, Label, HintText, Tooltip and NativeSelect, plus the upstream class-merging helper and semantic theme. Components are built on React Aria and Tailwind CSS. No documentation preview components or demo application code is shipped.

MONO customizations: emerald semantic theme; Vite @ alias; utility-only Tailwind import (no global reset); NativeSelect label/input IDs separated and disabled options forwarded; required indicators are visual CSS markers excluded from accessible names; FieldInput adapter retains native date/time/number constraints while exposing labels, hints, error/disabled/read-only states, optional icons/tooltips and currency prefixes. Controlled string callbacks are available as onValueChange, with native onChange compatibility for existing forms. Forms submit through existing typed domain handlers, independent of Clerk/Supabase/payment vendors.

Only needed components are wired into production. Password visibility is already supported by InputBase. Do not collect raw payment-card details through a generic input: future payments should use gateway-hosted secure fields. File selection must be connected to an authorized upload service before any upload is presented as complete. Provider-controlled authentication screens remain owned by Clerk.

## Conversation component references

The supplied progress, carousel, date-picker, loading, empty-state, messaging, metric, modal, typography and inline-CTA documents are usage references, not implementation files. PRO examples have not been copied. `ConversationElements`, `CalendarPicker` and the MONO carousel/message styling are original compositions using existing shared fields, React Aria ProgressBar/Calendar and Modal/Dialog primitives, and MONO semantic surfaces. Native date inputs remain available alongside keyboard-accessible calendars. The modal is limited to destructive conversation reset confirmation; vehicle review remains inline.

Inline CTAs call existing conversation/domain handlers. Metrics count actual local records. Brief completeness reflects entered details, not search progress. Loading appears only while the workspace code loads. No fake payment-method, receipt, subscription or message-delivery state is rendered. Future Paystack checkout and receipts require authoritative server-confirmed payment records.
