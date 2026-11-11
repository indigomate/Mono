/** Commercial proposal only. These values never authorize billing or gate the demo. */
export const providerPlans = [
  {
    id: "starter",
    name: "Starter",
    monthly: 0,
    yearly: 0,
    commission: 12,
    description: "For private owners getting started",
    features: [
      "2 active vehicle or service listings",
      "1 operator account",
      "Chat-assisted listing and request management",
      "Standard storefront and core booking tools",
    ],
  },
  {
    id: "grow",
    name: "Grow",
    monthly: 499,
    yearly: 4990,
    commission: 10,
    description: "For a growing rental business",
    features: [
      "10 active vehicle or service listings",
      "3 operator seats with roles",
      "Everything in Starter",
      "Availability calendar and bulk updates",
      "Business analytics and CSV exports",
      "Enhanced storefront and saved reply templates",
    ],
  },
  {
    id: "fleet",
    name: "Fleet",
    monthly: 1499,
    yearly: 14990,
    commission: 8,
    description: "For teams managing more supply",
    features: [
      "50 active vehicle or service listings",
      "10 operator seats with roles",
      "Everything in Grow",
      "Multi-location operations and team assignments",
      "Advanced reports and audit history",
      "API/webhook access and priority operational support",
    ],
  },
] as const;
export type ProviderPlanId = (typeof providerPlans)[number]["id"];
