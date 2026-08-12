"use client";

import { useRouter } from "next/navigation";
import { PlanCard, type PlanFeatureRow } from "@/components/shared/plan-card";
import { useMembershipPlans, type MembershipPlan } from "@/hooks/use-membership-plans";

// Every card renders the same row labels (greyed out when absent) so
// they line up for comparison, same as the reference layout.
function planFeatures(plan: MembershipPlan): PlanFeatureRow[] {
  const rows: PlanFeatureRow[] = [
    { label: `${plan.plan_contacts} contact views`, included: plan.plan_contacts > 0 },
    { label: `${plan.profile} profile views`, included: plan.profile > 0 },
    { label: `${plan.plan_msg} messages`, included: plan.plan_msg > 0 },
    { label: "In-app chat", included: !!plan.chat },
    { label: "Video calling", included: !!plan.video },
  ];
  return rows;
}

export default function PlansPage() {
  const router = useRouter();
  const { data: plans, isLoading, isError } = useMembershipPlans();

  const mostExpensive = plans?.reduce(
    (max, p) => (Number(p.plan_amount) > Number(max?.plan_amount ?? -1) ? p : max),
    plans[0]
  );

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
            const isBestValue = plan.plan_id === mostExpensive?.plan_id && !isFree;
            return (
              <PlanCard
                key={plan.plan_id}
                name={plan.plan_name}
                price={isFree ? "₹0" : `₹${Number(plan.plan_amount).toLocaleString("en-IN")}`}
                period={isFree ? "forever" : `/ ${plan.plan_duration} days`}
                tagline={plan.plan_offers || undefined}
                badge={isBestValue ? "Best value" : undefined}
                dark={isBestValue}
                ctaLabel={isFree ? "Current plan" : `Go ${plan.plan_name}`}
                onSelect={isFree ? undefined : () => router.push("/checkout")}
                features={planFeatures(plan)}
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
