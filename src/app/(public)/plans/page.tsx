"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlanCard } from "@/components/shared/plan-card";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePlans } from "@/hooks/use-plans";
import type { PlanDuration } from "@/types/plans";

export default function PlansPage() {
  const router = useRouter();
  const [duration, setDuration] = useState<PlanDuration>("6");
  const { data: plans } = usePlans();
  const price = plans?.pricingByDuration[duration] ?? { premium: "—", elite: "—" };
  const comparisonRows = plans?.comparisonRows ?? [];
  const per = `/ ${duration} months`;

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
        <SegmentedControl
          value={duration}
          onChange={setDuration}
          className="mx-auto w-fit bg-card ring-1.5 ring-input"
          options={[
            { label: "3 months", value: "3" },
            { label: "6 months −20%", value: "6" },
            { label: "12 months", value: "12" },
          ]}
        />
      </div>

      <div className="mb-10 flex flex-col gap-4.5 lg:mb-14 lg:grid lg:grid-cols-3 lg:gap-6.5">
        <PlanCard
          name="Free"
          price="₹0"
          period="forever"
          tagline="Browse and get discovered"
          ctaLabel="Current plan"
          features={[
            "Create a full profile",
            "Browse verified profiles",
            "5 interests per month",
            "Daily match suggestions",
          ]}
        />
        <PlanCard
          name="Premium"
          price={price.premium}
          period={per}
          tagline="Everything you need to connect"
          badge="Most popular"
          dark
          ctaLabel="Go Premium"
          onSelect={() => router.push("/checkout")}
          features={[
            "Unlimited interests & chat",
            "View 100 contact numbers",
            "See who visited you",
            "Horoscope match reports",
            "Priority in search results",
          ]}
        />
        <PlanCard
          name="Elite"
          price={price.elite}
          period={per}
          tagline="Personal matchmaking assistance"
          ctaLabel="Talk to us"
          onSelect={() => router.push("/checkout")}
          className="border-gold-light"
          features={[
            "Everything in Premium",
            "Dedicated relationship manager",
            "Handpicked weekly matches",
            "Profile highlight & Elite badge",
            "Family meeting coordination",
          ]}
        />
      </div>

      <h2 className="mb-3.5 text-lg font-extrabold text-primary-deep lg:mb-5.5 lg:text-center lg:text-[26px]">
        Compare all features
      </h2>
      <div className="overflow-hidden rounded-[18px] border border-card-border bg-card lg:rounded-[22px]">
        <div className="grid grid-cols-[1.7fr_1fr_1fr_1fr] bg-surface px-4 py-3 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:px-8 lg:py-4.5">
          <span className="text-[11px] font-extrabold tracking-wide text-faint uppercase lg:text-[13px]">
            Feature
          </span>
          <span className="text-center text-[11px] font-extrabold text-primary-deep lg:text-sm">
            Free
          </span>
          <span className="text-center text-[11px] font-extrabold text-gold lg:text-sm">
            ★ Prem
          </span>
          <span className="text-center text-[11px] font-extrabold text-primary-deep lg:text-sm">
            ♛ Elite
          </span>
        </div>
        {comparisonRows.map((r) => (
          <div
            key={r.feature}
            className="grid grid-cols-[1.7fr_1fr_1fr_1fr] items-center border-t border-[#F5F6F9] px-4 py-3 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:px-8 lg:py-4"
          >
            <span className="text-xs font-semibold text-ink lg:text-[14.5px]">{r.feature}</span>
            <span
              className={cn(
                "text-center text-xs font-bold lg:text-sm",
                r.free === "—" ? "text-faint" : "text-success"
              )}
            >
              {r.free}
            </span>
            <span
              className={cn(
                "rounded-lg bg-surface-cream py-1.5 text-center text-xs font-bold lg:py-2 lg:text-sm",
                r.premium === "—" ? "text-faint" : "text-success"
              )}
            >
              {r.premium}
            </span>
            <span
              className={cn(
                "text-center text-xs font-bold lg:text-sm",
                r.elite === "—" ? "text-faint" : "text-success"
              )}
            >
              {r.elite}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 hidden justify-center gap-7 text-[13.5px] font-semibold text-faint lg:flex">
        <span>🔒 Secure payments</span>
        <span>↩ 7-day refund on unused plans</span>
        <span>🛡 Verified members only</span>
      </div>

      <div className="h-24 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-card-border bg-card/95 px-5 py-3.5 pb-5 backdrop-blur-md lg:hidden">
        <Button size="cta" variant="gold" className="w-full" render={<Link href="/checkout" />}>
          Go Premium — {price.premium} {per}
        </Button>
      </div>
    </div>
  );
}
