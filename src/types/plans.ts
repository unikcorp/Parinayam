export type PlanDuration = "3" | "6" | "12";

export interface PlanDurationPricing {
  premium: string;
  elite: string;
}

export interface PlanComparisonRow {
  feature: string;
  free: string;
  premium: string;
  elite: string;
}

export interface PlansData {
  pricingByDuration: Record<PlanDuration, PlanDurationPricing>;
  comparisonRows: PlanComparisonRow[];
}
