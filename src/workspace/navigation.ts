export type CustomerView =
  | "customer"
  | "chat"
  | "bookings"
  | "chauffeur"
  | "airport"
  | "events"
  | "group"
  | "tours"
  | "long-term"
  | "custom";
export type ProviderView =
  "provider" | "provider-profile" | "owner" | "provider-requests" | "store";
export type View = CustomerView | ProviderView | "workspaces";
export type Navigate = (view: View | "home") => void;
export const providerViews: readonly string[] = [
  "provider",
  "provider-profile",
  "owner",
  "provider-requests",
  "store",
];
export const validViews: readonly string[] = [
  "customer",
  "chat",
  "bookings",
  "chauffeur",
  "airport",
  "events",
  "group",
  "tours",
  "long-term",
  "custom",
  ...providerViews,
  "workspaces",
];
