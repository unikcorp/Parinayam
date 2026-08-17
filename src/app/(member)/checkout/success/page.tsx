"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMySubscriptions } from "@/features/subscription/use-subscription";
import { useMembership } from "@/features/membership/use-membership";
import { useMyProfile } from "@/hooks/use-my-profile";

function limitLabel(limit: number | null, noun: string) {
  return limit === null ? `Unlimited ${noun}` : `${limit} ${noun}`;
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value.includes("T") ? value : value.replace(" ", "T") + "Z").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function OrderSuccessPageInner() {
  const searchParams = useSearchParams();
  const subscriptionId = Number(searchParams.get("subscription"));

  const { data: profile } = useMyProfile();
  const { data: subscriptions, isLoading: subsLoading } = useMySubscriptions();
  const { limits, canUseChat, canSeeWhoViewedMe, canUseAdvancedSearch, isLoading: membershipLoading } = useMembership();

  const subscription = subscriptions?.find((s) => s.id === subscriptionId);

  if (subsLoading || membershipLoading) {
    return <div className="py-24 text-center text-sm text-faint">Loading…</div>;
  }

  if (!subscription) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-5 py-24 text-center">
        <p className="text-sm font-semibold text-destructive">We couldn&apos;t find this order.</p>
        <Button size="sm" render={<Link href="/plans" />}>
          Back to plans
        </Button>
      </div>
    );
  }

  const paidAmount = Number(subscription.paid_amount);
  const discountAmount = Number(subscription.discount_amount);
  const originalPrice = Number(subscription.original_price);
  const expiresAt = formatDate(subscription.expires_at);

  const unlocked = [
    limits && limitLabel(limits.interests, "interests"),
    canUseChat ? "Private chat with matches" : limits && `${limitLabel(limits.messages, "messages")} per member`,
    limits && `${limitLabel(limits.contactViews, "contact number views")}`,
    canSeeWhoViewedMe && "See who visited your profile",
    canUseAdvancedSearch && "Advanced search filters",
  ].filter((v): v is string => Boolean(v));

  return (
    <div className="mx-auto max-w-lg px-5 py-10 lg:py-16">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-success-bg">
          <Check className="size-8 text-success" strokeWidth={3} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-[28px]">
          Welcome to {subscription.plan_name_snapshot}
          {profile?.member.first_name ? `, ${profile.member.first_name}` : ""} ✨
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your payment was successful and your plan is now active.
        </p>
      </div>

      <div className="mt-7 rounded-[20px] border border-card-border bg-card p-6 lg:p-7">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[15px] font-extrabold text-primary-deep">{subscription.plan_name_snapshot}</span>
          <span className="rounded-full bg-success-bg px-2.75 py-1 text-[11px] font-extrabold text-success uppercase">
            {expiresAt ? `Active till ${expiresAt}` : "Active"}
          </span>
        </div>

        <div className="flex flex-col gap-2.5 text-sm">
          <Row label="Order ID" value={`PNM-${subscription.id}`} />
          <Row label="Date" value={formatDate(subscription.started_at) ?? "-"} />
          <Row label="Plan amount" value={`₹${originalPrice.toLocaleString("en-IN")}`} />
          {discountAmount > 0 && <Row label="Discount" value={`− ₹${discountAmount.toLocaleString("en-IN")}`} tone="success" />}
          <div className="flex items-baseline justify-between border-t border-card-border pt-3.5">
            <span className="text-[15px] font-extrabold text-primary-deep">Amount paid</span>
            <span className="text-xl font-extrabold text-primary-deep">₹{paidAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {unlocked.length > 0 && (
        <div className="mt-6 rounded-[20px] border border-card-border bg-card p-6 lg:p-7">
          <div className="mb-3.5 text-[15px] font-extrabold text-primary-deep">Now unlocked for you</div>
          <ul className="flex flex-col gap-2.5">
            {unlocked.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-ink">
                <Check className="size-4 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="flex-1 gap-2" type="button">
          <Download className="size-4" /> Download invoice
        </Button>
        <Button className="flex-1" render={<Link href="/dashboard" />}>
          Go to dashboard
        </Button>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-faint">Loading…</div>}>
      <OrderSuccessPageInner />
    </Suspense>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={tone === "success" ? "font-bold text-success" : "font-bold text-primary-deep"}>{value}</span>
    </div>
  );
}
