"use client";

import { Check, Video, MessageCircle } from "lucide-react";
import { useMyProfile } from "@/hooks/use-my-profile";
import { useMembershipPlans } from "@/hooks/use-membership-plans";

export default function BillingSettingsPage() {
  const { data: profile } = useMyProfile();
  const { data: plans, isLoading, isError } = useMembershipPlans();

  return (
    <div className="flex flex-col gap-5.5">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep">Membership & Billing</h1>

      <section className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-7">
        <div className="text-[13px] font-bold tracking-wide text-faint uppercase">Current plan</div>
        <div className="mt-1 text-xl font-extrabold text-primary-deep">Free</div>
        <p className="mt-1 text-[13px] text-faint">
          {profile?.member.first_name ? `${profile.member.first_name}, y` : "Y"}ou're not subscribed to a paid plan yet.
        </p>
      </section>

      <div>
        <div className="mb-3 text-lg font-extrabold text-primary-deep">Available plans</div>

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.plan_id} className="flex flex-col gap-3 rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px]">
                <div className="text-base font-extrabold text-primary-deep">{plan.plan_name}</div>
                <div className="text-2xl font-extrabold text-primary-deep">
                  ₹{plan.plan_amount}
                  <span className="text-xs font-semibold text-faint"> / {plan.plan_duration} months</span>
                </div>
                <ul className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-success" /> {plan.plan_contacts} contact views
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-success" /> {plan.profile} profile views
                  </li>
                  {plan.chat && (
                    <li className="flex items-center gap-2">
                      <MessageCircle className="size-3.5 text-success" /> Chat included
                    </li>
                  )}
                  {plan.video && (
                    <li className="flex items-center gap-2">
                      <Video className="size-3.5 text-success" /> Video call included
                    </li>
                  )}
                  {plan.plan_offers && <li className="text-faint">{plan.plan_offers}</li>}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
