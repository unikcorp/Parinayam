// Mirrors server/src/modules/entitlements/entitlements.types.ts's
// CandidatePlan / PurchasePreview shapes exactly — same hand-synced
// convention as the rest of this feature folder.
import type { MembershipFeatures, MembershipLimits } from "./types";
import type { MembershipContribution, MembershipRemaining } from "./summary-types";

export interface CandidatePlan {
  planId: number;
  planName: string;
  durationDays: number | null;
  limits: MembershipLimits;
  features: MembershipFeatures;
}

export interface PurchasePreview {
  hasExistingBenefits: boolean;
  existingContributions: MembershipContribution[];
  newPlan: CandidatePlan;
  projected: {
    limits: MembershipLimits;
    usage: {
      profileViews: number;
      contactViews: number;
      messages: number;
      interests: number;
    };
    remaining: MembershipRemaining;
    features: MembershipFeatures;
  };
}
