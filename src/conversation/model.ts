import { read } from "../demo/storage";
import { isService, type ServiceType } from "../demo/services";
export type ToolKind =
  | "services"
  | "trip"
  | "vehicles"
  | "vehicle"
  | "enquiry"
  | "requests"
  | "profile"
  | "listing"
  | "fleet"
  | "inbox"
  | "storefront"
  | "summary";
export type ChatTool = {
  kind: ToolKind;
  stage?: "details" | "quote";
  service?: Exclude<ServiceType, "self-drive">;
  vehicleId?: number;
  ids?: number[];
};
export type Turn = {
  id: string;
  role: "user" | "assistant";
  text: string;
  tool?: ChatTool;
};
const kinds: ToolKind[] = [
  "services",
  "trip",
  "vehicles",
  "vehicle",
  "enquiry",
  "requests",
  "profile",
  "listing",
  "fleet",
  "inbox",
  "storefront",
  "summary",
];
export function turn(role: Turn["role"], text: string, tool?: ChatTool): Turn {
  return { id: crypto.randomUUID(), role, text, tool };
}
export function loadTurns(role: "customer" | "provider"): Turn[] {
  try {
    const v = JSON.parse(read(`mono-${role}-chat-v1`) || "null");
    if (Array.isArray(v)) {
      const rows = v
        .filter(
          (t) =>
            t &&
            typeof t.id === "string" &&
            ["user", "assistant"].includes(t.role) &&
            typeof t.text === "string",
        )
        .slice(-60)
        .map((t) => {
          const raw = t.tool;
          const tool: ChatTool | undefined =
            raw && kinds.includes(raw.kind)
              ? {
                  kind: raw.kind,
                  stage:
                    raw.stage === "quote"
                      ? "quote"
                      : raw.stage === "details"
                        ? "details"
                        : undefined,
                  service:
                    isService(raw.service) && raw.service !== "self-drive"
                      ? raw.service
                      : undefined,
                  vehicleId: Number.isFinite(raw.vehicleId)
                    ? raw.vehicleId
                    : undefined,
                  ids: Array.isArray(raw.ids)
                    ? raw.ids
                        .filter((n: unknown) => typeof n === "number")
                        .slice(0, 20)
                    : undefined,
                }
              : undefined;
          return { id: t.id, role: t.role, text: t.text.slice(0, 5000), tool };
        });
      if (rows.length) return rows;
    }
  } catch {
    /* Recover invalid browser transcripts. */
  }
  if (role === "customer") {
    try {
      const legacy = JSON.parse(read("mono-journey-v1") || "null");
      if (Array.isArray(legacy?.messages)) {
        const rows = legacy.messages
          .filter(
            (m: { role?: string; text?: string }) =>
              m &&
              ["user", "assistant"].includes(m.role || "") &&
              typeof m.text === "string",
          )
          .slice(-40)
          .map((m: { role: Turn["role"]; text: string }) =>
            turn(m.role, m.text),
          );
        if (rows.length) return rows;
      }
    } catch {
      /* Ignore corrupt legacy history. */
    }
  }
  return [
    turn(
      "assistant",
      role === "customer"
        ? "Tell me what you need: a car to drive yourself, a chauffeur, an airport transfer or something entirely different. We can plan and review it right here."
        : "Tell me about your business or what you want to do. We can set up your profile, add a vehicle or service, and review your collection in this conversation.",
    ),
  ];
}
export function detectService(text: string): ServiceType | null {
  const s = text.toLowerCase();
  if (/self[ -]?drive|without a driver|drive myself/.test(s))
    return "self-drive";
  if (/airport|flight|transfer/.test(s)) return "airport";
  if (/wedding|event|matric|prom/.test(s)) return "events";
  if (
    /group|shuttle|bus|passengers/.test(s) &&
    /transport|driver|group|shuttle/.test(s)
  )
    return "group";
  if (/tour|day trip|wine tasting/.test(s)) return "tours";
  if (/long[ -]?term|subscription|monthly|per month/.test(s))
    return "long-term";
  if (/chauffeur|with a driver|hire a driver/.test(s)) return "chauffeur";
  if (/custom|something else|other rental/.test(s)) return "custom";
  return null;
}
export const toolTitles: Record<ToolKind, string> = {
  services: "Service choices",
  trip: "Trip details",
  vehicles: "Vehicle matches",
  vehicle: "Vehicle review",
  enquiry: "Service brief",
  requests: "Your requests",
  profile: "Provider profile",
  listing: "Listing draft",
  fleet: "Vehicles & services",
  inbox: "Provider inbox",
  storefront: "Storefront preview",
  summary: "Business summary",
};
