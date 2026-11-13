import type { Draft } from "../demo/marketplace";
import { services, type ProviderProfile } from "../demo/services";

export type ReadinessStepId =
  | "provider"
  | "basics"
  | "photos"
  | "verification"
  | "availability"
  | "terms"
  | "review";

export type ReadinessStep = {
  id: ReadinessStepId;
  shortLabel: string;
  title: string;
  description: string;
  complete: boolean;
};

export const needsDriverDocuments = (draft: Draft) =>
  draft.services.some(
    (id) => services.find((service) => service.id === id)?.driver,
  );

export function providerReadiness(
  draft: Draft,
  profile: ProviderProfile,
): ReadinessStep[] {
  const a = draft.activation;
  const providerComplete = Boolean(
    profile.name.trim() && profile.area.trim() && profile.services.length,
  );
  const basicsComplete = Boolean(
    draft.name.trim() &&
    draft.area.trim() &&
    draft.services.length &&
    (draft.rateUnit === "quote" || draft.price > 0),
  );
  const verificationComplete = Boolean(
    a.ownership &&
    a.documentNames.length >= 2 &&
    a.insuranceConfirmed &&
    a.roadworthyConfirmed &&
    (!needsDriverDocuments(draft) || a.driverDocumentNames.length >= 2),
  );
  const availabilityComplete = Boolean(
    a.availabilityMode &&
    a.minimumDays >= 1 &&
    a.noticeHours >= 0 &&
    a.pickupInstructions.trim(),
  );
  const pricingComplete = draft.services.every(
    (service) =>
      draft.rateUnit === "quote" ||
      (a.serviceRates[service] ||
        (draft.services.length === 1 ? draft.price : 0)) > 0,
  );
  const termsComplete = Boolean(
    a.fuelPolicy && a.cancellationPolicy && pricingComplete,
  );
  const beforeReview = [
    providerComplete,
    basicsComplete,
    a.photoNames.length >= 4,
    verificationComplete,
    availabilityComplete,
    termsComplete,
  ];

  return [
    {
      id: "provider",
      shortLabel: "Provider",
      title: "Introduce the provider",
      description:
        "Customers need to know whether they are booking a private owner, chauffeur or fleet operator.",
      complete: providerComplete,
    },
    {
      id: "basics",
      shortLabel: "Vehicle",
      title: "Describe the vehicle and service",
      description:
        "Add the essentials customers use to understand and compare this listing.",
      complete: basicsComplete,
    },
    {
      id: "photos",
      shortLabel: "Photos",
      title: "Show the real vehicle",
      description:
        "Choose at least four clear, recent photos: front, rear, interior and condition detail.",
      complete: a.photoNames.length >= 4,
    },
    {
      id: "verification",
      shortLabel: "Trust",
      title: "Prepare verification",
      description:
        "Gather ownership, operating and safety evidence. Files stay local in this demo and are not uploaded.",
      complete: verificationComplete,
    },
    {
      id: "availability",
      shortLabel: "Operations",
      title: "Set availability and fulfilment",
      description:
        "Explain when the vehicle can be requested and how pickup or delivery works.",
      complete: availabilityComplete,
    },
    {
      id: "terms",
      shortLabel: "Terms",
      title: "Set protection and rental rules",
      description:
        "Make the deposit, mileage, fuel and cancellation expectations clear before checkout.",
      complete: termsComplete,
    },
    {
      id: "review",
      shortLabel: "Review",
      title: "Review before verification",
      description:
        "Confirm the prepared details and see the integrations still required before publishing.",
      complete: beforeReview.every(Boolean) && a.reviewAccepted,
    },
  ];
}

export const readinessCount = (draft: Draft, profile: ProviderProfile) =>
  providerReadiness(draft, profile).filter((step) => step.complete).length;
