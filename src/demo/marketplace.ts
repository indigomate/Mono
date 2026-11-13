import { isISODate } from "../utils/dates";
import { isService, type ServiceType } from "./services";
import { cars } from "./inventory";
import { read, write, loadArray } from "./storage";
export const inventory = cars.map((c) => ({
  ...c,
  transmission: "Automatic",
  seats: 5,
}));
export type Vehicle = (typeof inventory)[number];
export type Trip = {
  location: string;
  start: string;
  end: string;
  days: number;
  budget: number;
  budgetMode: "daily" | "total";
  category: string;
  make: string;
  tier: string;
  transmission: string;
  passengers: number;
};
export type Message = { role: "user" | "assistant"; text: string };
export type ListingActivation = {
  make: string;
  model: string;
  year: number;
  colour: string;
  registrationLast6: string;
  ownership: "" | "owned" | "authorised";
  photoNames: string[];
  documentNames: string[];
  driverDocumentNames: string[];
  insuranceConfirmed: boolean;
  roadworthyConfirmed: boolean;
  availabilityMode: "" | "on-request" | "calendar";
  minimumDays: number;
  noticeHours: number;
  pickupInstructions: string;
  deliveryRadiusKm: number;
  securityDeposit: number;
  mileagePerDay: number;
  serviceRates: Partial<Record<ServiceType, number>>;
  fuelPolicy: "" | "same-to-same" | "full-to-full" | "included";
  cancellationPolicy: "" | "flexible" | "moderate" | "strict";
  reviewAccepted: boolean;
  verificationStatus: "draft" | "ready";
};
export type Draft = {
  id: string;
  name: string;
  price: number;
  area: string;
  transmission: string;
  seats: number;
  status: "draft" | "preview";
  notes: string;
  vehicleType: string;
  services: ServiceType[];
  rateUnit: "day" | "hour" | "trip" | "month" | "quote";
  activation: ListingActivation;
};
export type Request = {
  id: string | number;
  car: string;
  start: string;
  end: string;
  email: string;
  total: number;
  status: string;
  createdAt?: string;
};
export const emptyTrip: Trip = {
  location: "Cape Town",
  start: "",
  end: "",
  days: 0,
  budget: 0,
  budgetMode: "daily",
  category: "",
  make: "",
  tier: "",
  transmission: "",
  passengers: 0,
};
export const money = (n: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const emptyListingActivation = (): ListingActivation => ({
  make: "",
  model: "",
  year: 0,
  colour: "",
  registrationLast6: "",
  ownership: "",
  photoNames: [],
  documentNames: [],
  driverDocumentNames: [],
  insuranceConfirmed: false,
  roadworthyConfirmed: false,
  availabilityMode: "",
  minimumDays: 1,
  noticeHours: 24,
  pickupInstructions: "",
  deliveryRadiusKm: 0,
  securityDeposit: 0,
  mileagePerDay: 200,
  serviceRates: {},
  fuelPolicy: "",
  cancellationPolicy: "",
  reviewAccepted: false,
  verificationStatus: "draft",
});

export function normalizeListingActivation(value: unknown): ListingActivation {
  const base = emptyListingActivation();
  if (!value || typeof value !== "object") return base;
  const v = value as Partial<ListingActivation>;
  return {
    ...base,
    make: typeof v.make === "string" ? v.make.slice(0, 80) : "",
    model: typeof v.model === "string" ? v.model.slice(0, 80) : "",
    year:
      typeof v.year === "number" && v.year >= 1950 && v.year <= 2100
        ? v.year
        : 0,
    colour: typeof v.colour === "string" ? v.colour.slice(0, 50) : "",
    registrationLast6:
      typeof v.registrationLast6 === "string"
        ? v.registrationLast6.replace(/[^a-z0-9]/gi, "").slice(-6)
        : "",
    ownership: ["owned", "authorised"].includes(v.ownership || "")
      ? (v.ownership as ListingActivation["ownership"])
      : "",
    photoNames: Array.isArray(v.photoNames)
      ? v.photoNames
          .filter((name): name is string => typeof name === "string")
          .slice(0, 12)
      : [],
    documentNames: Array.isArray(v.documentNames)
      ? v.documentNames
          .filter((name): name is string => typeof name === "string")
          .slice(0, 8)
      : [],
    driverDocumentNames: Array.isArray(v.driverDocumentNames)
      ? v.driverDocumentNames
          .filter((name): name is string => typeof name === "string")
          .slice(0, 8)
      : [],
    insuranceConfirmed: v.insuranceConfirmed === true,
    roadworthyConfirmed: v.roadworthyConfirmed === true,
    availabilityMode: ["on-request", "calendar"].includes(
      v.availabilityMode || "",
    )
      ? (v.availabilityMode as ListingActivation["availabilityMode"])
      : "",
    minimumDays:
      typeof v.minimumDays === "number" && v.minimumDays >= 1
        ? Math.min(v.minimumDays, 365)
        : 1,
    noticeHours:
      typeof v.noticeHours === "number" && v.noticeHours >= 0
        ? Math.min(v.noticeHours, 8760)
        : 24,
    pickupInstructions:
      typeof v.pickupInstructions === "string"
        ? v.pickupInstructions.slice(0, 500)
        : "",
    deliveryRadiusKm:
      typeof v.deliveryRadiusKm === "number" && v.deliveryRadiusKm >= 0
        ? Math.min(v.deliveryRadiusKm, 1000)
        : 0,
    securityDeposit:
      typeof v.securityDeposit === "number" && v.securityDeposit >= 0
        ? Math.min(v.securityDeposit, 10000000)
        : 0,
    mileagePerDay:
      typeof v.mileagePerDay === "number" && v.mileagePerDay >= 0
        ? Math.min(v.mileagePerDay, 10000)
        : 200,
    serviceRates:
      v.serviceRates && typeof v.serviceRates === "object"
        ? Object.fromEntries(
            Object.entries(v.serviceRates)
              .filter(
                ([id, amount]) =>
                  isService(id) &&
                  typeof amount === "number" &&
                  amount >= 0 &&
                  amount <= 10000000,
              )
              .slice(0, 8),
          )
        : {},
    fuelPolicy: ["same-to-same", "full-to-full", "included"].includes(
      v.fuelPolicy || "",
    )
      ? (v.fuelPolicy as ListingActivation["fuelPolicy"])
      : "",
    cancellationPolicy: ["flexible", "moderate", "strict"].includes(
      v.cancellationPolicy || "",
    )
      ? (v.cancellationPolicy as ListingActivation["cancellationPolicy"])
      : "",
    reviewAccepted: v.reviewAccepted === true,
    verificationStatus: v.verificationStatus === "ready" ? "ready" : "draft",
  };
}
export const duration = (trip: Trip) =>
  trip.start && trip.end
    ? Math.max(
        0,
        Math.round((Date.parse(trip.end) - Date.parse(trip.start)) / 86400000),
      )
    : trip.days;
export function loadJourney(): {
  trip: Trip;
  messages: Message[];
  searched: boolean;
} {
  try {
    const v = JSON.parse(read("mono-journey-v1") || "null");
    if (
      v &&
      typeof v.trip === "object" &&
      v.trip &&
      Array.isArray(v.messages)
    ) {
      const trip = { ...emptyTrip };
      for (const k of Object.keys(trip) as (keyof Trip)[]) {
        if (typeof v.trip[k] === typeof trip[k])
          Object.assign(trip, { [k]: v.trip[k] });
      }
      for (const key of ["start", "end"] as const)
        if (trip[key] && !isISODate(trip[key])) trip[key] = "";
      if (!["daily", "total"].includes(trip.budgetMode))
        trip.budgetMode = "daily";
      for (const k of ["days", "budget", "passengers"] as const)
        if (!Number.isFinite(trip[k]) || trip[k] < 0) trip[k] = 0;
      return {
        trip,
        messages: v.messages
          .filter(
            (m: Message) =>
              m &&
              ["user", "assistant"].includes(m.role) &&
              typeof m.text === "string",
          )
          .slice(-40),
        searched: v.searched === true,
      };
    }
  } catch {
    /* Recover from invalid demo storage. */
  }
  return {
    trip: { ...emptyTrip, location: read("mono-city") || "Cape Town" },
    messages: [],
    searched: false,
  };
}
export function saveDemo(key: string, value: unknown) {
  write(key, JSON.stringify(value));
}
export function loadDrafts(): Draft[] {
  return loadArray("mono-listings").map((v: Partial<Draft>, i: number) => ({
    id: typeof v.id === "string" ? v.id : `legacy-${i}`,
    name: v.name!,
    price: v.price!,
    area: v.area!,
    transmission:
      typeof v.transmission === "string" ? v.transmission : "Automatic",
    seats: typeof v.seats === "number" && v.seats > 0 ? v.seats : 5,
    status: v.status === "preview" ? "preview" : "draft",
    notes: typeof v.notes === "string" ? v.notes : "",
    vehicleType: typeof v.vehicleType === "string" ? v.vehicleType : "Sedan",
    services:
      Array.isArray(v.services) && v.services.some(isService)
        ? v.services.filter(isService)
        : ["self-drive"],
    rateUnit: ["day", "hour", "trip", "month", "quote"].includes(
      v.rateUnit || "",
    )
      ? v.rateUnit!
      : "day",
    activation: normalizeListingActivation(v.activation),
  }));
}
export function loadRequests(): Request[] {
  return loadArray("mono-requests");
}
export function interpret(text: string, previous: Trip): Trip {
  const t = { ...previous };
  const lower = text.toLowerCase();
  const amount = text.match(/\b(?:ZAR|R)\s*(\d+(?:[ ,]\d{3})*(?:\.\d{1,2})?)/i);
  if (amount) {
    const value = Number(amount[1].replace(/[ ,]/g, ""));
    if (Number.isFinite(value) && value > 0) t.budget = value;
  }
  if (/\b(total|whole|entire|overall)\b/i.test(text)) t.budgetMode = "total";
  else if (/\b(daily|per day|a day|each day)\b/i.test(text))
    t.budgetMode = "daily";
  const days = lower.match(/\b(\d+)\s*(?:days?|nights?)\b/);
  if (days) t.days = Math.min(365, Number(days[1]));
  if (/\b(suv|4x4)\b/.test(lower)) t.category = "SUV";
  else if (/\b(sedan|business|wedding)\b/.test(lower)) t.category = "Sedan";
  else if (/\b(any car|any type|all cars)\b/.test(lower)) t.category = "";
  if (/\b(minibus|van)\b/.test(lower)) t.category = "Van / minibus";
  if (/\b(bakkie|pickup)\b/.test(lower)) t.category = "Bakkie / pickup";
  if (/\b(motorbike|motorcycle)\b/.test(lower)) t.category = "Motorcycle";
  if (/\b(camper|motorhome)\b/.test(lower)) t.category = "Camper / motorhome";
  if (/\btruck\b/.test(lower)) t.category = "Truck";
  if (/\bautomatic\b/.test(lower)) t.transmission = "Automatic";
  else if (/\bmanual\b/.test(lower)) t.transmission = "Manual";
  for (const make of ["Audi", "BMW", "Toyota", "Range Rover"])
    if (lower.includes(make.toLowerCase())) t.make = make;
  if (/\b(luxury|premium|business|wedding)\b/.test(lower)) t.tier = "Premium";
  if (/\b(affordable|cheap|economy)\b/.test(lower)) t.tier = "Economy";
  if (/\b(any car|any type|all cars)\b/.test(lower)) {
    t.category = "";
    t.make = "";
    t.tier = "";
  }
  const passengers = lower.match(/\b(\d+)\s*(?:people|passengers|seats)\b/);
  if (passengers) t.passengers = Number(passengers[1]);
  if (/affordable|cheap|economy/.test(lower) && !amount) {
    t.budget = 1000;
    t.budgetMode = "daily";
  }
  if (/\bcape town\b/.test(lower)) t.location = "Cape Town";
  const dates = text.match(/\b\d{4}-\d{2}-\d{2}\b/g)?.filter(isISODate);
  if (dates?.length === 2 && dates[1] > dates[0]) {
    t.start = dates[0];
    t.end = dates[1];
  }
  return t;
}
export function matches(trip: Trip) {
  const days = duration(trip);
  if (
    trip.location.trim().toLowerCase() !== "cape town" ||
    (trip.budgetMode === "total" && trip.budget > 0 && !days)
  )
    return [];
  return inventory.filter(
    (c) =>
      (!trip.make || c.name.startsWith(trip.make)) &&
      (!trip.tier ||
        (trip.tier === "Premium" ? c.price >= 1300 : c.price < 1000)) &&
      (!trip.category ||
        (trip.category === "Luxury / exotic"
          ? /luxury|premium/i.test(c.type)
          : c.type.toLowerCase().includes(trip.category.toLowerCase()))) &&
      (!trip.transmission || c.transmission === trip.transmission) &&
      (!trip.passengers || c.seats >= trip.passengers) &&
      (!trip.budget ||
        (trip.budgetMode === "total" ? c.price * days : c.price) <=
          trip.budget),
  );
}
export function reply(trip: Trip, count: number) {
  if (trip.location.trim().toLowerCase() !== "cape town")
    return "This demo covers Cape Town only. Update your pickup city to explore sample cars.";
  if (trip.budgetMode === "total" && trip.budget && !duration(trip))
    return "I have your total rental budget. Add your dates or number of days so I can compare trip costs.";
  if (!count)
    return "No sample cars fit all your preferences. Edit your trip to try another budget, vehicle type or transmission.";
  return `I found ${count} sample ${count === 1 ? "match" : "matches"} using your saved trip preferences. ${trip.start && trip.end ? "Your dates are saved. Availability still needs owner confirmation." : "Choose pickup and return dates in your trip summary to review a rental estimate."}`;
}
