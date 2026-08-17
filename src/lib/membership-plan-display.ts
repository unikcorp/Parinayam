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

export interface PlanBadge {
  planId: number;
  label: "Most Popular" | "Best Value";
}

// Structural, not name-based — "Most Popular"/"Best Value" are derived from
// price ranking among the premium (is_premium) plans, never by matching a
// plan's name. An admin renaming/reordering/adding plans just shifts which
// plan gets which badge instead of breaking.
export function getPlanBadges(plans: MembershipPlan[]): Map<number, PlanBadge["label"]> {
  const premiumByPrice = plans
    .filter((p) => p.is_premium)
    .slice()
    .sort((a, b) => Number(a.plan_amount) - Number(b.plan_amount));

  const badges = new Map<number, PlanBadge["label"]>();
  if (premiumByPrice.length === 0) return badges;

  const bestValue = premiumByPrice[premiumByPrice.length - 1];
  badges.set(bestValue.plan_id, "Best Value");

  // "Most popular" = the middle tier — the second-cheapest premium plan
  // when there are 3+, otherwise skipped (nothing sensible to call "most
  // popular" with only one or two premium plans).
  if (premiumByPrice.length >= 3) {
    const mostPopular = premiumByPrice[1];
    if (mostPopular.plan_id !== bestValue.plan_id) {
      badges.set(mostPopular.plan_id, "Most Popular");
    }
  }

  return badges;
}
