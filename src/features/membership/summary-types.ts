// Mirrors server/src/modules/entitlements/entitlements.types.ts's
// EntitlementRemaining / MembershipContribution / MembershipSummary shapes
// exactly — kept in sync by hand, same convention as types.ts.
import type { Entitlements, MembershipFeatures, MembershipLimits, MembershipUsage } from "./types";

export interface MembershipRemaining {
  profileViews: number | null;
  contactViews: number | null;
  messages: number | null;
  interests: number | null;
}

export interface MembershipContribution {
  subscriptionId: number;
  planId: number;
  planName: string;
  isPrimary: boolean;
  expiresAt: string | null;
  daysRemaining: number | null;
  isExpiringSoon: boolean;
  limits: MembershipLimits;
  usage: MembershipUsage;
  remaining: MembershipRemaining;
  features: MembershipFeatures;
}

export interface MembershipSummary extends Entitlements {
  daysRemaining: number | null;
  remaining: MembershipRemaining;
  contributions: MembershipContribution[];
}

export const NUMERIC_FEATURE_KEYS = ["profileViews", "contactViews", "messages", "interests"] as const;
export type NumericFeatureKey = (typeof NUMERIC_FEATURE_KEYS)[number];

export const NUMERIC_FEATURE_LABELS: Record<NumericFeatureKey, string> = {
  profileViews: "Profile Views",
  contactViews: "Contact Views",
  messages: "Messages",
  interests: "Interests",
};
