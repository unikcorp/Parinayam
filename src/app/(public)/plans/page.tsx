"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlanCard } from "@/components/shared/plan-card";
import { useMembershipPlans } from "@/hooks/use-membership-plans";
import { useMembership } from "@/features/membership/use-membership";
import { getPlanBadges, getPlanFeatures } from "@/lib/membership-plan-display";
import { ApiError } from "@/lib/api";
import { useConfirmSubscription, useInitiateSubscription } from "@/features/subscription/use-subscription";
import { PlanCardsSkeleton } from "@/components/shared/loading-skeletons";
import { useMyEligibleCoupons } from "@/features/coupon/use-coupon";
import { Gift } from "lucide-react";

export default function PlansPage() {
  const router = useRouter();
  const { data: plans, isLoading, isError } = useMembershipPlans();
  // isActive means a real member_subscriptions row exists — planName alone
  // isn't enough to mean "already selected", since the backend returns
  // planName: "Free" as an implicit fallback for anyone with no active
  // subscription at all (never actually chosen). Without the isActive
  // check, Free always looked pre-selected and its button was permanently
  // disabled, even for a member who'd never picked anything.
  const { planName: currentPlanName, isActive, isLoading: membershipLoading } = useMembership();

  const initiate = useInitiateSubscription();
  const confirm = useConfirmSubscription();
  const [activatingPlanId, setActivatingPlanId] = useState<number | null>(null);

  // Private/targeted coupons — only ever shown to the member they're
  // assigned to, resolved server-side from the JWT. No code is ever typed.
  const { data: eligibleCoupons } = useMyEligibleCoupons();
  const couponByPlanId = new Map((eligibleCoupons ?? []).map((c) => [c.planId, c]));

  const badges = getPlanBadges(plans ?? []);

  // The plan the member is actively on right now, if any — used to block
  // self-service downgrades (matches the same rule enforced server-side in
  // initiateSubscription).
  const currentPlan = isActive ? (plans ?? []).find((p) => p.plan_name === currentPlanName) : undefined;

  // Free costs nothing, so it skips the payment-method screen entirely —
  // it's activated the moment the member picks it. Paid plans still go
  // through /checkout since there's actually money to collect there.
  async function activateFree(planId: number) {
    setActivatingPlanId(planId);
    try {
      const { subscription_id } = await initiate.mutateAsync(planId);
      await confirm.mutateAsync({ subscriptionId: subscription_id, gatewayPaymentId: `stub_${Date.now()}` });
      router.push(`/checkout/success?subscription=${subscription_id}`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not activate the Free plan. Please try again.");
      setActivatingPlanId(null);
    }
  }

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

      {!!eligibleCoupons?.length && (
        <div className="mx-auto mb-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-dashed border-gold bg-surface-cream-2 px-5 py-4 text-center lg:mb-10">
          <Gift className="size-5 shrink-0 text-gold-text" />
          <p className="text-sm font-bold text-primary-deep">
            🎁 You have a special membership offer available.
          </p>
        </div>
      )}

      {isLoading && <PlanCardsSkeleton />}

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
            const isCurrentPlan = !membershipLoading && isActive && currentPlanName === plan.plan_name;
            const isActivating = activatingPlanId === plan.plan_id;
            const isDowngrade = !isCurrentPlan && !!currentPlan && plan.sort_order < currentPlan.sort_order;

            // Same "bigger discount wins" rule the backend applies — a
            // private coupon only overrides the public offer's displayed
            // price if it's actually the better deal.
            const originalPrice = Number(plan.plan_amount);
            const offerDiscount = plan.offer ? originalPrice - plan.offer.offer_price : 0;
            const coupon = couponByPlanId.get(plan.plan_id);
            const showCoupon = !!coupon && coupon.discountAmount > offerDiscount;
            const displayPrice = showCoupon ? coupon.finalPrice : Number(plan.plan_amount);

            return (
              <PlanCard
                key={plan.plan_id}
                name={plan.plan_name}
                price={isFree ? "₹0" : `₹${displayPrice.toLocaleString("en-IN")}`}
                period={isFree ? "forever" : `/ ${plan.plan_duration} days`}
                tagline={
                  showCoupon
                    ? `🎁 Special price for you — was ₹${originalPrice.toLocaleString("en-IN")}`
                    : plan.plan_offers || undefined
                }
                badge={showCoupon ? "Special Offer" : badge}
                dark={showCoupon || badge === "Best Value"}
                ctaLabel={
                  isCurrentPlan
                    ? "Current Plan"
                    : isDowngrade
                      ? "Not available"
                      : isActivating
                        ? "Activating…"
                        : `Go ${plan.plan_name}`
                }
                onSelect={
                  isCurrentPlan || isActivating || isDowngrade
                    ? undefined
                    : isFree
                      ? () => activateFree(plan.plan_id)
                      : () => router.push(`/checkout?plan=${plan.plan_id}`)
                }
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
