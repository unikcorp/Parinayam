"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Star, Tag, CreditCard, Landmark, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api";
import { useMembershipPlans } from "@/hooks/use-membership-plans";
import { useConfirmSubscription, useInitiateSubscription } from "@/features/subscription/use-subscription";
import { SectionSkeleton } from "@/components/shared/loading-skeletons";
import { useMembershipSummary } from "@/features/membership/use-membership-summary";
import { useEntitlementsPreview } from "@/features/membership/use-entitlements-preview";
import { PurchaseConfirmation } from "@/features/membership/components/PurchaseConfirmation";
import {
  useConfirmHighlightPurchase,
  useHighlightPackages,
  useInitiateHighlightPurchase,
} from "@/features/profile-highlight/use-profile-highlight";
import { useMyEligibleCouponForPlan } from "@/features/coupon/use-coupon";

type Method = "upi" | "card" | "netbanking" | "wallet";
const upiApps = ["GPay", "PhonePe", "Paytm", "Other UPI"];

function CheckoutPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = Number(searchParams.get("plan"));
  const highlightPackageId = searchParams.get("highlight");

  // Profile Highlight is an independent purchasable feature from Membership
  // — same page, same initiate->confirm->pay flow, but against the
  // highlight endpoints and with no offer/carry-forward logic (a highlight
  // purchase always cleanly extends the current one, nothing to explain
  // before payment).
  if (highlightPackageId) {
    return <HighlightCheckout packageId={Number(highlightPackageId)} />;
  }

  const { data: plans, isLoading: plansLoading, isError: plansError } = useMembershipPlans();
  const plan = plans?.find((p) => p.plan_id === planId);

  // Buying while something's still active never cancels it (carried-forward
  // upgrade / stacked purchase) — if that's about to happen, show what it
  // means before payment instead of only letting it be discovered after.
  const { summary, isLoading: summaryLoading } = useMembershipSummary();
  const hasExistingBenefits = (summary?.contributions.length ?? 0) > 0;
  const [confirmed, setConfirmed] = useState(false);
  const { preview, isLoading: previewLoading } = useEntitlementsPreview(
    Number.isNaN(planId) ? null : planId,
    hasExistingBenefits && !confirmed,
  );

  const initiate = useInitiateSubscription();
  const confirm = useConfirmSubscription();
  const isProcessing = initiate.isPending || confirm.isPending;

  const [method, setMethod] = useState<Method>("upi");
  const [upiApp, setUpiApp] = useState(upiApps[0]);
  const [upiId, setUpiId] = useState("");

  const originalPrice = plan ? Number(plan.plan_amount) : 0;
  const offerPrice = plan?.offer ? plan.offer.offer_price : null;
  const offerDiscount = offerPrice != null ? Math.round((originalPrice - offerPrice) * 100) / 100 : 0;

  // Private/targeted coupon for this exact plan, if the member is eligible
  // — display only. Same "bigger discount wins, never stacked" rule the
  // backend enforces; the actual charged amount always comes back from the
  // initiate/confirm response below, never computed here.
  const { data: eligibleCoupon } = useMyEligibleCouponForPlan(Number.isNaN(planId) ? null : planId);
  const useCoupon = !!eligibleCoupon && eligibleCoupon.discountAmount > offerDiscount;

  const discount = useCoupon ? eligibleCoupon.discountAmount : offerDiscount;
  const total = Math.round((originalPrice - discount) * 100) / 100;

  async function handlePay() {
    if (!plan) return;
    try {
      // The backend recomputes the real price itself from the plan + any
      // active offer — nothing priced here is trusted, this call just
      // starts the attempt.
      const { subscription_id } = await initiate.mutateAsync(plan.plan_id);
      // No real payment gateway is wired up yet — the backend's gateway is
      // a deliberate stub that always succeeds (see payment-gateway.stub.ts),
      // so a real one can plug in here later without this flow changing.
      await confirm.mutateAsync({ subscriptionId: subscription_id, gatewayPaymentId: `stub_${Date.now()}` });
      router.push(`/checkout/success?subscription=${subscription_id}`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Payment could not be completed. Please try again.");
    }
  }

  if (plansLoading || summaryLoading) {
    return (
      <div className="mx-auto max-w-215 px-5 py-8 lg:px-6">
        <SectionSkeleton />
      </div>
    );
  }

  if (plansError || !plan) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-sm font-semibold text-destructive">This plan isn&apos;t available.</p>
        <p className="text-sm text-faint">Please choose a plan again.</p>
        <Button size="sm" onClick={() => router.push("/plans")}>
          Back to plans
        </Button>
      </div>
    );
  }

  // Show the carry-forward confirmation before payment, only when there's
  // actually something active to explain. Once acknowledged, the rest of
  // this component renders exactly as it did before this feature existed.
  if (hasExistingBenefits && !confirmed) {
    if (previewLoading || !preview) {
      return (
        <div className="mx-auto max-w-215 px-5 py-8 lg:px-6">
          <SectionSkeleton />
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-215 px-5 py-8 lg:px-6">
        <PurchaseConfirmation preview={preview} onConfirm={() => setConfirmed(true)} onCancel={() => router.back()} />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-290 grid-cols-1 gap-6 px-5 pt-6 pb-8 lg:grid-cols-[1fr_420px] lg:items-start lg:gap-8 lg:px-6 lg:pt-10 lg:pb-16">
      {/* PAYMENT METHODS */}
      <main>
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1.5 text-[13.5px] font-bold text-muted-foreground hover:text-primary-deep"
        >
          <ChevronLeft className="size-4" /> Back
        </button>

        <h1 className="mb-1.5 text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-[28px]">
          Complete your payment
        </h1>
        <p className="mb-6 text-sm text-muted-foreground lg:mb-7 lg:text-[14.5px]">
          Choose how you&apos;d like to pay.
        </p>

        {/* UPI */}
        <MethodCard selected={method === "upi"} onSelect={() => setMethod("upi")} title="UPI" badge="Recommended · Instant">
          {method === "upi" && (
            <>
              <div className="mb-4.5 grid grid-cols-2 gap-2.5 lg:flex lg:gap-3">
                {upiApps.map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setUpiApp(app)}
                    className={cn(
                      "flex-1 rounded-[13px] border p-3.5 text-center text-[13.5px] font-bold",
                      upiApp === app ? "border-primary bg-[#FBFCFE] text-primary" : "border-input text-muted-foreground"
                    )}
                  >
                    {app}
                  </button>
                ))}
              </div>
              <label className="mb-2 block text-[12.5px] font-bold text-primary-deep">UPI ID</label>
              <div className="flex gap-3">
                <Input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@bank"
                  className="h-auto flex-1 rounded-xl px-4 py-3.5 text-sm"
                />
                <Button variant="outline" type="button">
                  Verify
                </Button>
              </div>
            </>
          )}
        </MethodCard>

        {/* CARD */}
        <MethodCard
          selected={method === "card"}
          onSelect={() => setMethod("card")}
          title="Credit / Debit card"
          icon={CreditCard}
          trailing={
            <span className="flex gap-1.5">
              {["VISA", "MC", "RuPay"].map((c) => (
                <span key={c} className="rounded-md border border-input px-2.5 py-1 text-[10.5px] font-extrabold text-muted-foreground">
                  {c}
                </span>
              ))}
            </span>
          }
        />

        {/* NET BANKING */}
        <MethodCard
          selected={method === "netbanking"}
          onSelect={() => setMethod("netbanking")}
          title="Net banking"
          icon={Landmark}
          trailing={<span className="text-xs font-semibold text-faint">SBI, Federal, HDFC, ICICI +38</span>}
        />

        {/* WALLET */}
        <MethodCard
          selected={method === "wallet"}
          onSelect={() => setMethod("wallet")}
          title="Wallets"
          icon={Wallet}
          trailing={<span className="text-xs font-semibold text-faint">Amazon Pay, Mobikwik</span>}
          last
        />
      </main>

      {/* ORDER SUMMARY */}
      <aside className="flex flex-col gap-4.5 lg:sticky lg:top-6">
        <div className="rounded-[20px] border border-card-border bg-card p-6 lg:p-7">
          <div className="mb-4.5 text-base font-extrabold text-primary-deep lg:text-[17px]">Order summary</div>
          <div className="mb-5 flex items-center gap-3.5 rounded-2xl bg-primary-deep p-4 text-white">
            <span className="bg-gold-gradient flex size-11 shrink-0 items-center justify-center rounded-xl">
              <Star className="size-[19px] fill-current" />
            </span>
            <div className="flex-1">
              <div className="text-[15px] font-extrabold">{plan.plan_name}</div>
              <div className="mt-0.5 text-xs text-white/70">
                {plan.plan_duration ? `${plan.plan_duration}-day plan` : "Lifetime plan"} · cancel anytime
              </div>
            </div>
          </div>

          {useCoupon ? (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-dashed border-[#7BD3B0] bg-success-bg/60 px-4 py-3">
              <Tag className="size-4 text-success" />
              <div>
                <div className="text-[13.5px] font-extrabold text-success">
                  Special Offer for You — {eligibleCoupon.couponName}
                </div>
                <div className="text-[11.5px] text-muted-foreground">Applied automatically</div>
              </div>
            </div>
          ) : (
            plan.offer && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-dashed border-[#7BD3B0] bg-success-bg/60 px-4 py-3">
                <Tag className="size-4 text-success" />
                <div>
                  <div className="text-[13.5px] font-extrabold text-success">{plan.offer.title}</div>
                  <div className="text-[11.5px] text-muted-foreground">Applied automatically</div>
                </div>
              </div>
            )
          )}

          <div className="flex flex-col gap-2.5 text-sm">
            <Row label={`${plan.plan_name} plan`} value={`₹${originalPrice.toLocaleString("en-IN")}`} />
            {discount > 0 && (
              <Row
                label={useCoupon ? `Coupon ${eligibleCoupon.couponCode}` : "Offer discount"}
                value={`− ₹${discount.toLocaleString("en-IN")}`}
                tone="success"
              />
            )}
            <div className="flex items-baseline justify-between border-t border-card-border pt-3.5">
              <span className="text-[15px] font-extrabold text-primary-deep">Total payable</span>
              <span className="text-2xl font-extrabold text-primary-deep">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <Button variant="gold" size="cta" className="mt-5.5 w-full" disabled={isProcessing} onClick={handlePay}>
            {isProcessing ? "Processing…" : `Pay ₹${total.toLocaleString("en-IN")} securely`}
          </Button>
          <div className="mt-3 text-center text-xs text-faint">
            By paying you agree to the Terms &amp; Refund Policy.
          </div>
        </div>

        <div className="hidden justify-center gap-5 text-[12.5px] font-semibold text-faint lg:flex">
          <span>🔒 PCI-DSS</span>
          <span>↩ 7-day refund</span>
          <span>🧾 Invoice on request</span>
        </div>
      </aside>
    </div>
  );
}

function HighlightCheckout({ packageId }: { packageId: number }) {
  const router = useRouter();
  const { data: packages, isLoading, isError } = useHighlightPackages();
  const pkg = packages?.find((p) => p.id === packageId);

  const initiate = useInitiateHighlightPurchase();
  const confirm = useConfirmHighlightPurchase();
  const isProcessing = initiate.isPending || confirm.isPending;

  const price = pkg ? Number(pkg.price) : 0;

  async function handlePay() {
    if (!pkg) return;
    try {
      const { purchase_id } = await initiate.mutateAsync(pkg.id);
      await confirm.mutateAsync({ purchaseId: purchase_id, gatewayPaymentId: `stub_${Date.now()}` });
      router.push(`/checkout/success?highlight=${purchase_id}`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Payment could not be completed. Please try again.");
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-215 px-5 py-8 lg:px-6">
        <SectionSkeleton />
      </div>
    );
  }

  if (isError || !pkg) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-sm font-semibold text-destructive">This Highlight package isn&apos;t available.</p>
        <p className="text-sm text-faint">Please choose a package again.</p>
        <Button size="sm" onClick={() => router.push("/plans/highlight")}>
          Back to Highlight packages
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-215 px-5 pt-6 pb-8 lg:px-6 lg:pt-10 lg:pb-16">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1.5 text-[13.5px] font-bold text-muted-foreground hover:text-primary-deep"
      >
        <ChevronLeft className="size-4" /> Back
      </button>

      <div className="rounded-[20px] border border-card-border bg-card p-6 lg:p-7">
        <div className="mb-4.5 text-base font-extrabold text-primary-deep lg:text-[17px]">Order summary</div>
        <div className="mb-5 flex items-center gap-3.5 rounded-2xl bg-primary-deep p-4 text-white">
          <span className="bg-gold-gradient flex size-11 shrink-0 items-center justify-center rounded-xl">
            <Star className="size-[19px] fill-current" />
          </span>
          <div className="flex-1">
            <div className="text-[15px] font-extrabold">{pkg.package_name}</div>
            <div className="mt-0.5 text-xs text-white/70">{pkg.duration_days}-day Profile Highlight</div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 text-sm">
          <Row label={pkg.package_name} value={`₹${price.toLocaleString("en-IN")}`} />
          <div className="flex items-baseline justify-between border-t border-card-border pt-3.5">
            <span className="text-[15px] font-extrabold text-primary-deep">Total payable</span>
            <span className="text-2xl font-extrabold text-primary-deep">₹{price.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <Button variant="gold" size="cta" className="mt-5.5 w-full" disabled={isProcessing} onClick={handlePay}>
          {isProcessing ? "Processing…" : `Pay ₹${price.toLocaleString("en-IN")} securely`}
        </Button>
        <div className="mt-3 text-center text-xs text-faint">
          If you already have an active Highlight, this extends it — the remaining time carries forward.
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-215 px-5 py-8 lg:px-6">
          <SectionSkeleton />
        </div>
      }
    >
      <CheckoutPageInner />
    </Suspense>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-bold", tone === "success" ? "text-success" : "text-primary-deep")}>{value}</span>
    </div>
  );
}

function MethodCard({
  selected,
  onSelect,
  title,
  badge,
  icon: Icon,
  trailing,
  children,
  last,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  badge?: string;
  icon?: typeof CreditCard;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] border bg-card p-5 lg:p-6",
        selected ? "border-2 border-primary shadow-[0_8px_26px_rgba(185,28,28,0.08)]" : "border-card-border",
        !last && "mb-3.5"
      )}
    >
      <button type="button" onClick={onSelect} className="flex w-full items-center gap-3.5">
        <span
          className={cn(
            "flex size-5.5 shrink-0 items-center justify-center rounded-full border-2",
            selected ? "border-[7px] border-primary" : "border-input"
          )}
        />
        {Icon && <Icon className="size-[18px] text-primary-deep" />}
        <span className="flex-1 text-left text-[15.5px] font-bold text-primary-deep">{title}</span>
        {badge && (
          <span className="rounded-full bg-success-bg px-2.75 py-1 text-[11px] font-extrabold text-success">
            {badge.toUpperCase()}
          </span>
        )}
        {trailing}
      </button>
      {selected && children && <div className="mt-5">{children}</div>}
    </div>
  );
}
