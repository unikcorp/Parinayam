"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMySubscriptions } from "@/features/subscription/use-subscription";
import { useMembership } from "@/features/membership/use-membership";
import { useMyProfile } from "@/hooks/use-my-profile";
import { SectionSkeleton } from "@/components/shared/loading-skeletons";
import { useHighlightHistory } from "@/features/profile-highlight/use-profile-highlight";

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
  const highlightPurchaseId = searchParams.get("highlight");

  if (highlightPurchaseId) {
    return <HighlightSuccess purchaseId={Number(highlightPurchaseId)} />;
  }

  const { data: profile } = useMyProfile();
  const { data: subscriptions, isLoading: subsLoading } = useMySubscriptions();
  const { limits, canUseChat, canSeeWhoViewedMe, canUseAdvancedSearch, isLoading: membershipLoading } = useMembership();

  const subscription = subscriptions?.find((s) => s.id === subscriptionId);

  if (subsLoading || membershipLoading) {
    return (
      <div className="mx-auto max-w-215 px-5 py-8 lg:px-6">
        <SectionSkeleton />
      </div>
    );
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

  function handleDownloadInvoice() {
    const win = window.open("", "_blank");
    if (!win) return;
    const discountRow =
      discountAmount > 0
        ? `<tr><td>${subscription!.coupon_code ? `Coupon (${subscription!.coupon_code})` : "Offer discount"}</td><td style="text-align:right">− ₹${discountAmount.toLocaleString("en-IN")}</td></tr>`
        : "";
    win.document.write(`<!doctype html><html><head><title>Invoice PNM-${subscription!.id}</title>
      <style>
        body{font-family:Arial,sans-serif;color:#2a1414;max-width:560px;margin:40px auto;padding:0 20px}
        h1{color:#7a1e2b;font-size:20px;margin-bottom:2px}
        .muted{color:#777;font-size:13px;margin-bottom:24px}
        table{width:100%;border-collapse:collapse;margin-top:16px}
        td{padding:8px 0;font-size:14px;border-bottom:1px solid #eee}
        .total td{border-top:2px solid #333;border-bottom:none;font-weight:bold;font-size:16px;padding-top:14px}
        @media print{.no-print{display:none}}
      </style></head><body>
      <h1>Parinayam</h1>
      <div class="muted">Payment Invoice · Order PNM-${subscription!.id}</div>
      <table>
        <tr><td>Plan</td><td style="text-align:right">${subscription!.plan_name_snapshot}</td></tr>
        <tr><td>Date</td><td style="text-align:right">${formatDate(subscription!.started_at) ?? "-"}</td></tr>
        <tr><td>Plan amount</td><td style="text-align:right">₹${originalPrice.toLocaleString("en-IN")}</td></tr>
        ${discountRow}
        <tr class="total"><td>Amount paid</td><td style="text-align:right">₹${paidAmount.toLocaleString("en-IN")}</td></tr>
      </table>
      <p class="no-print" style="margin-top:32px;font-size:13px;color:#777">Use your browser's Print dialog (Ctrl/Cmd+P) and choose "Save as PDF" to download this invoice.</p>
      </body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

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
          {discountAmount > 0 && (
            <Row
              label={subscription.coupon_code ? `Coupon ${subscription.coupon_code}` : "Offer discount"}
              value={`− ₹${discountAmount.toLocaleString("en-IN")}`}
              tone="success"
            />
          )}
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
        <Button variant="outline" className="flex-1 gap-2" type="button" onClick={handleDownloadInvoice}>
          <Download className="size-4" /> Download invoice
        </Button>
        <Button className="flex-1" render={<Link href="/dashboard" />}>
          Go to dashboard
        </Button>
      </div>
    </div>
  );
}

function HighlightSuccess({ purchaseId }: { purchaseId: number }) {
  const { data: history, isLoading } = useHighlightHistory();
  const purchase = history?.find((p) => p.id === purchaseId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-215 px-5 py-8 lg:px-6">
        <SectionSkeleton />
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-5 py-24 text-center">
        <p className="text-sm font-semibold text-destructive">We couldn&apos;t find this order.</p>
        <Button size="sm" render={<Link href="/plans/highlight" />}>
          Back to Highlight packages
        </Button>
      </div>
    );
  }

  const expiresAt = formatDate(purchase.expires_at);

  return (
    <div className="mx-auto max-w-lg px-5 py-10 lg:py-16">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-success-bg">
          <Check className="size-8 text-success" strokeWidth={3} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-[28px]">
          Your profile is now highlighted ✨
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Your payment was successful and your Highlight is now active.</p>
      </div>

      <div className="mt-7 rounded-[20px] border border-card-border bg-card p-6 lg:p-7">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[15px] font-extrabold text-primary-deep">{purchase.package_name_snapshot}</span>
          <span className="rounded-full bg-success-bg px-2.75 py-1 text-[11px] font-extrabold text-success uppercase">
            {expiresAt ? `Active till ${expiresAt}` : "Active"}
          </span>
        </div>

        <div className="flex flex-col gap-2.5 text-sm">
          <Row label="Order ID" value={`PNM-HL-${purchase.id}`} />
          <Row label="Date" value={formatDate(purchase.started_at) ?? "-"} />
          <div className="flex items-baseline justify-between border-t border-card-border pt-3.5">
            <span className="text-[15px] font-extrabold text-primary-deep">Amount paid</span>
            <span className="text-xl font-extrabold text-primary-deep">
              ₹{Number(purchase.paid_amount).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button className="flex-1" render={<Link href="/settings/profile-highlight" />}>
          View my Highlight
        </Button>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-215 px-5 py-8 lg:px-6">
          <SectionSkeleton />
        </div>
      }
    >
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
