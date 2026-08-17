"use client";

import { useRouter } from "next/navigation";
import { PlanCard } from "@/components/shared/plan-card";
import { useMembershipPlans } from "@/hooks/use-membership-plans";
import { useMembership } from "@/features/membership/use-membership";
import { getPlanBadges, getPlanFeatures } from "@/lib/membership-plan-display";

export default function PlansPage() {
  const router = useRouter();
  const { data: plans, isLoading, isError } = useMembershipPlans();
  const { planName: currentPlanName, isLoading: membershipLoading } = useMembership();

  const badges = getPlanBadges(plans ?? []);

  return (
    <div className="mx-auto max-w-290 px-5 pt-8 pb-10 lg:px-6 lg:pt-12">
      <div className="mb-8 text-center lg:mb-10">
        <div className="mb-2.5 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
          Membership
        </div>
        <h1 className="mb-2 text-[25px] font-extrabold tracking-[-0.02em] text-primary-deep lg:mb-3 lg:text-[42px]">
          <span className="lg:hidden">Choose your plan</span>
          <span className="hidden lg:inline">Choose the plan that fits your journey</span>
        </h1>
        <p className="mb-4.5 text-[13.5px] text-muted-foreground lg:mb-6 lg:text-[16.5px]">
          Cancel anytime. All plans include verified-only browsing.
        </p>
      </div>

      {isLoading && <div className="py-16 text-center text-sm text-faint">Loading plans…</div>}

      {isError && (
        <div className="py-16 text-center text-sm font-semibold text-destructive">
          Unable to load membership plans. Please try again.
        </div>
      )}

      {plans && plans.length === 0 && (
        <div className="py-16 text-center text-sm text-faint">No plans available right now. Check back soon.</div>
      )}

      {plans && plans.length > 0 && (
        <div className="mb-10 flex flex-col gap-4.5 lg:mb-14 lg:grid lg:grid-cols-4 lg:gap-6.5">
          {plans.map((plan) => {
            const isFree = Number(plan.plan_amount) === 0;
            const badge = badges.get(plan.plan_id);
            const isCurrentPlan = !membershipLoading && currentPlanName === plan.plan_name;
            return (
              <PlanCard
                key={plan.plan_id}
                name={plan.plan_name}
                price={isFree ? "₹0" : `₹${Number(plan.plan_amount).toLocaleString("en-IN")}`}
                period={isFree ? "forever" : `/ ${plan.plan_duration} days`}
                tagline={plan.plan_offers || undefined}
                badge={badge}
                dark={badge === "Best Value"}
                ctaLabel={isCurrentPlan ? "Current Plan" : `Go ${plan.plan_name}`}
                onSelect={isCurrentPlan ? undefined : () => router.push(`/checkout?plan=${plan.plan_id}`)}
                className={isCurrentPlan ? "border-success ring-2 ring-success/20" : undefined}
                features={getPlanFeatures(plan)}
              />
            );
          })}
        </div>
      )}

      <div className="mt-6 hidden justify-center gap-7 text-[13.5px] font-semibold text-faint lg:flex">
        <span>🔒 Secure payments</span>
        <span>↩ 7-day refund on unused plans</span>
        <span>🛡 Verified members only</span>
      </div>
    </div>
  );
}
