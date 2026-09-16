import type { PlanFeatureRow } from "@/components/shared/plan-card";
import type { MembershipPlan } from "@/hooks/use-membership-plans";

// Video Calling removed entirely per spec — never rendered anywhere.
export function getPlanFeatures(plan: MembershipPlan): PlanFeatureRow[] {
  return [
    { label: `${plan.plan_contacts} contact views`, included: plan.plan_contacts > 0 },
    { label: `${plan.profile} profile views`, included: plan.profile > 0 },
    {
      label: plan.plan_msg === null ? "Unlimited messages" : `${plan.plan_msg} messages`,
      included: plan.plan_msg === null || plan.plan_msg > 0,
    },
    {
      label: plan.interest_limit === null ? "Unlimited interests" : `${plan.interest_limit} interests`,
      included: plan.interest_limit === null || plan.interest_limit > 0,
    },
    { label: "In-app chat", included: !!plan.chat },
    { label: "Advanced search filters", included: !!plan.can_use_advanced_search },
    { label: "See who viewed you", included: !!plan.can_see_who_viewed_me },
    { label: "Profile boost", included: !!plan.can_use_profile_boost },
    { label: "Priority visibility in search", included: !!plan.has_priority_visibility },
  ];
}

// Admin-configured, never derived — a plan only shows a tag when an admin
// has actually set one in the Admin Panel. No tag configured = no badge
// rendered (never an empty placeholder).
export function getPlanBadgeLabel(plan: MembershipPlan): "Best Value" | "Most Popular" | undefined {
  if (plan.badge_label === "BEST_VALUE") return "Best Value";
  if (plan.badge_label === "MOST_POPULAR") return "Most Popular";
  return undefined;
}
