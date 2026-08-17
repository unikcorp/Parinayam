"use client";

import { useRouter } from "next/navigation";
import { PlanCard } from "@/components/shared/plan-card";
import { useMyProfile } from "@/hooks/use-my-profile";
import { useMembershipPlans } from "@/hooks/use-membership-plans";
import { useMembership } from "@/features/membership/use-membership";
import { getPlanBadges, getPlanFeatures } from "@/lib/membership-plan-display";

export default function BillingSettingsPage() {
  const router = useRouter();
  const { data: profile } = useMyProfile();
  const { data: plans, isLoading, isError } = useMembershipPlans();
  const { planName: currentPlanName, isPremium, expiresAt, isLoading: membershipLoading } = useMembership();

  const badges = getPlanBadges(plans ?? []);

  return (
    <div className="flex flex-col gap-5.5">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep">Membership & Billing</h1>

      <section className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-7">
        <div className="text-[13px] font-bold tracking-wide text-faint uppercase">Current plan</div>
        <div className="mt-1 text-xl font-extrabold text-primary-deep">
          {membershipLoading ? "…" : (currentPlanName ?? "Free")}
        </div>
        <p className="mt-1 text-[13px] text-faint">
          {membershipLoading ? (
            "Loading your plan…"
          ) : isPremium ? (
            <>
              {profile?.member.first_name ?? "You"}&apos;re on a premium plan
              {expiresAt && ` — renews/expires ${new Date(expiresAt.replace(" ", "T") + "Z").toLocaleDateString("en-IN")}`}.
            </>
          ) : (
            <>{profile?.member.first_name ? `${profile.member.first_name}, y` : "Y"}ou&apos;re not subscribed to a paid plan yet.</>
          )}
        </p>
      </section>

      <div>
        <div className="mb-4 text-lg font-extrabold text-primary-deep">Available plans</div>

        {isLoading && <div className="py-10 text-center text-sm text-faint">Loading plans…</div>}

        {isError && (
          <div className="py-10 text-center text-sm font-semibold text-destructive">
            Unable to load membership plans.
          </div>
        )}

        {plans && plans.length === 0 && (
          <section className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-card-border bg-card p-10 text-center lg:rounded-[20px]">
            <span className="text-2xl">★</span>
            <p className="text-sm font-semibold text-ink">No plans available right now</p>
            <p className="text-sm text-faint">Check back soon for membership options.</p>
          </section>
        )}

        {plans && plans.length > 0 && (
          <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 xl:grid-cols-4">
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
                  badge={badge}
                  dark={badge === "Best Value"}
                  ctaLabel={isCurrentPlan ? "Current Plan" : `Go ${plan.plan_name}`}
                  onSelect={isCurrentPlan ? undefined : () => router.push(`/checkout?plan=${plan.plan_id}`)}
                  className={
                    isCurrentPlan
                      ? "border-success ring-2 ring-success/20"
                      : badge !== "Best Value" && !isFree
                        ? "border-gold-light"
                        : undefined
                  }
                  features={getPlanFeatures(plan)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
