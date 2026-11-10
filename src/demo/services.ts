import { read } from "./storage";
export const services = [
  {
    id: "self-drive",
    label: "Self-drive rental",
    short: "Self-drive",
    icon: "01",
    description: "Pick up the keys and take your own route.",
    unit: "day",
    driver: false,
  },
  {
    id: "chauffeur",
    label: "Chauffeur service",
    short: "Chauffeur",
    icon: "02",
    description: "A car and driver, for your schedule.",
    unit: "hour",
    driver: true,
  },
  {
    id: "airport",
    label: "Airport transfer",
    short: "Airport",
    icon: "03",
    description: "Plan a pickup, drop-off and luggage space.",
    unit: "trip",
    driver: true,
  },
  {
    id: "events",
    label: "Weddings & events",
    short: "Events",
    icon: "04",
    description: "Coordinate the vehicles and arrivals that matter.",
    unit: "quote",
    driver: true,
  },
  {
    id: "group",
    label: "Group transport",
    short: "Groups",
    icon: "05",
    description: "Keep everyone together with room to spare.",
    unit: "trip",
    driver: true,
  },
  {
    id: "tours",
    label: "Tours & day trips",
    short: "Tours",
    icon: "06",
    description: "Explore the Cape with an itinerary of your own.",
    unit: "quote",
    driver: true,
  },
  {
    id: "long-term",
    label: "Long-term & subscriptions",
    short: "Long-term",
    icon: "07",
    description: "A vehicle for a month, a season or your routine.",
    unit: "month",
    driver: false,
  },
  {
    id: "custom",
    label: "Something else",
    short: "Custom request",
    icon: "08",
    description: "Tell us what you need. Start with a custom brief.",
    unit: "quote",
    driver: false,
  },
] as const;
export type ServiceType = (typeof services)[number]["id"];
export const vehicleTypes = [
  "Hatchback",
  "Sedan",
  "SUV",
  "Luxury / exotic",
  "Van / minibus",
  "Bakkie / pickup",
  "Motorcycle",
  "Camper / motorhome",
  "Truck",
  "Other",
];
export const serviceLabel = (id: string) =>
  services.find((s) => s.id === id)?.label || "Self-drive rental";
export type ProviderProfile = {
  name: string;
  kind: "private-owner" | "fleet-business" | "chauffeur-operator" | "mixed";
  area: string;
  services: ServiceType[];
  description: string;
};
export const defaultProfile: ProviderProfile = {
  name: "",
  kind: "private-owner",
  area: "Cape Town",
  services: ["self-drive"],
  description: "",
};
export type ServiceInquiry = {
  id: string;
  service: Exclude<ServiceType, "self-drive">;
  vehicleType: string;
  driver: "with-driver" | "self-drive" | "flexible";
  date: string;
  time: string;
  end: string;
  pickup: string;
  destination: string;
  passengers: number;
  hours: number;
  budget: number;
  notes: string;
  email: string;
  createdAt: string;
};
export function isService(value: unknown): value is ServiceType {
  return services.some((s) => s.id === value);
}
export function loadProfile(): ProviderProfile {
  try {
    const v = JSON.parse(read("mono-provider-profile-v1") || "null");
    if (v && typeof v.name === "string" && typeof v.area === "string")
      return {
        name: v.name,
        kind: [
          "private-owner",
          "fleet-business",
          "chauffeur-operator",
          "mixed",
        ].includes(v.kind)
          ? v.kind
          : "private-owner",
        area: v.area,
        services: Array.isArray(v.services)
          ? v.services.filter(isService)
          : ["self-drive"],
        description: typeof v.description === "string" ? v.description : "",
      };
  } catch {
    /* Recover local demo state. */
  }
  return { ...defaultProfile, services: [...defaultProfile.services] };
}
export function loadInquiries(): ServiceInquiry[] {
  try {
    const list = JSON.parse(read("mono-service-inquiries-v1") || "[]");
    return Array.isArray(list)
      ? list
          .map((v) =>
            v && typeof v === "object"
              ? {
                  ...v,
                  driver: ["with-driver", "self-drive", "flexible"].includes(
                    v.driver,
                  )
                    ? v.driver
                    : "flexible",
                }
              : v,
          )
          .filter(
            (v) =>
              v &&
              isService(v.service) &&
              v.service !== "self-drive" &&
              [
                "id",
                "date",
                "time",
                "pickup",
                "destination",
                "notes",
                "email",
                "createdAt",
                "vehicleType",
                "end",
              ].every((k) => typeof v[k] === "string") &&
              ["passengers", "hours", "budget"].every(
                (k) => Number.isFinite(v[k]) && v[k] >= 0,
              ),
          )
      : [];
  } catch {
    return [];
  }
}
