import type { PlanDuration, PlanDurationPricing, PlanComparisonRow, PlansData } from "@/types/plans";

export const planPricingByDuration: Record<PlanDuration, PlanDurationPricing> = {
  "3": { premium: "₹2,940", elite: "₹8,070" },
  "6": { premium: "₹4,700", elite: "₹12,900" },
  "12": { premium: "₹8,400", elite: "₹23,000" },
};

export const planComparisonRows: PlanComparisonRow[] = [
  { feature: "Browse verified profiles", free: "✓", premium: "✓", elite: "✓" },
  { feature: "Express interests", free: "5 / month", premium: "Unlimited", elite: "Unlimited" },
  { feature: "Private chat & voice messages", free: "—", premium: "✓", elite: "✓" },
  { feature: "View contact numbers", free: "—", premium: "100", elite: "Unlimited" },
  { feature: "See who visited your profile", free: "—", premium: "✓", elite: "✓" },
  { feature: "Horoscope match reports", free: "—", premium: "✓", elite: "✓ + astrologer call" },
  { feature: "Priority in search results", free: "—", premium: "✓", elite: "Top placement" },
  { feature: "Dedicated relationship manager", free: "—", premium: "—", elite: "✓" },
  { feature: "Family meeting coordination", free: "—", premium: "—", elite: "✓" },
];

export async function fetchPlans(): Promise<PlansData> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { pricingByDuration: planPricingByDuration, comparisonRows: planComparisonRows };
}
