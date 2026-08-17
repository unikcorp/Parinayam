// Mirrors server/src/modules/entitlements/entitlements.types.ts's Entitlements
// shape exactly — kept in sync by hand, no shared types package between
// the two projects. planName is a plain string, not a fixed union: plan
// names are admin-managed data, never hardcoded here.
export interface MembershipLimits {
  profileViews: number | null;
  contactViews: number | null;
  messages: number | null;
  interests: number | null;
}

export interface MembershipUsage {
  profileViews: number;
  contactViews: number;
  messages: number;
  interests: number;
}

export interface MembershipFeatures {
  canUseChat: boolean;
  canUseAdvancedSearch: boolean;
  canSeeWhoViewedMe: boolean;
  canUseProfileBoost: boolean;
  hasPriorityVisibility: boolean;
}

export interface Entitlements {
  planName: string;
  isPremium: boolean;
  isActive: boolean;
  expiresAt: string | null;
  limits: MembershipLimits;
  usage: MembershipUsage;
  features: MembershipFeatures;
}
