"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Star, Tag, ShieldCheck } from "lucide-react";
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
import { useValidateCouponCode } from "@/features/coupon/use-coupon";
import type { ValidatedCoupon } from "@/features/coupon/api";

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
  // The gap between order-creation succeeding and the member finishing/
  // dismissing the Razorpay modal — neither mutation is "pending" during
  // that window, so isProcessing needs its own flag to stay disabled then.
  const [awaitingPayment, setAwaitingPayment] = useState(false);
  const isProcessing = initiate.isPending || confirm.isPending || awaitingPayment;

  const originalPrice = plan ? Number(plan.plan_amount) : 0;
  const offerPrice = plan?.offer ? plan.offer.offer_price : null;
  const offerDiscount = offerPrice != null ? Math.round((originalPrice - offerPrice) * 100) / 100 : 0;

  // The member's typed-in coupon code — no auto-detection anymore. Set only
  // once the code has been checked against this exact plan; the actual
  // charged amount is always independently recomputed server-side when the
  // purchase is initiated, this is display-only.
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<ValidatedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const validateCoupon = useValidateCouponCode();

  const useCoupon = !!appliedCoupon && appliedCoupon.discountAmount > offerDiscount;
  const discount = useCoupon ? appliedCoupon.discountAmount : offerDiscount;
  const total = Math.round((originalPrice - discount) * 100) / 100;

  function handleApplyCoupon() {
    if (!plan || !couponInput.trim()) return;
    setCouponError(null);
    validateCoupon.mutate(
      { code: couponInput.trim(), planId: plan.plan_id },
      {
        onSuccess: (data) => setAppliedCoupon(data),
        onError: (error) => setCouponError(error instanceof ApiError ? error.message : "Could not apply this code."),
      },
    );
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

  async function handlePay() {
    if (!plan) return;
    try {
      // The backend recomputes the real price itself from the plan + any
      // active offer + the coupon code (re-validated, never trusted as-is)
      // — nothing priced here is trusted, this call just starts the attempt.
      const { subscription_id, payment_order } = await initiate.mutateAsync({
        planId: plan.plan_id,
        couponCode: appliedCoupon?.couponCode,
      });

      if (payment_order.gateway === "free") {
        // ₹0 (Free plan, or a 100%-discount coupon/offer) — nothing to
        // charge, no Razorpay involved at all.
        await confirm.mutateAsync({ subscriptionId: subscription_id });
        router.push(`/checkout/success?subscription=${subscription_id}`);
        return;
      }

      if (!payment_order.orderId || !payment_order.keyId) {
        toast.error("Payment could not start. Please refresh and try again.");
        return;
      }

      // checkout.js loads async (afterInteractive) — it's normally ready
      // well before a member finishes reading this page, but give it a
      // moment rather than failing a perfectly good order outright.
      if (typeof window !== "undefined" && !window.Razorpay) {
        for (let attempt = 0; attempt < 20 && !window.Razorpay; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
      }
      if (typeof window === "undefined" || !window.Razorpay) {
        toast.error("Payment could not start. Please refresh and try again.");
        return;
      }

      setAwaitingPayment(true);
      const rzp = new window.Razorpay({
        key: payment_order.keyId,
        order_id: payment_order.orderId,
        amount: Math.round(payment_order.amount * 100),
        currency: payment_order.currency,
        name: "Parinayam",
        description: `${plan.plan_name} plan`,
        handler: (response) => {
          confirm
            .mutateAsync({
              subscriptionId: subscription_id,
              razorpay: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            })
            .then(() => {
              router.push(`/checkout/success?subscription=${subscription_id}`);
            })
            .catch((error) => {
              toast.error(
                error instanceof ApiError ? error.message : "Payment could not be verified. Please contact support.",
              );
            })
            .finally(() => setAwaitingPayment(false));
        },
        modal: {
          // Member closed the Checkout modal without paying — never call
          // confirm, never navigate anywhere. The subscription stays
          // PENDING (cleaned up later by the abandoned-checkout job if it's
          // never completed).
          ondismiss: () => setAwaitingPayment(false),
        },
      });
      rzp.open();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Payment could not be completed. Please try again.");
      setAwaitingPayment(false);
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
      {/* INFO */}
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
          Review your order, then pay securely — UPI, card, net banking, and wallets are all available on the
          next screen.
        </p>

        <div className="flex items-start gap-3.5 rounded-[18px] border border-card-border bg-card p-5 lg:p-6">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
          <div>
            <div className="text-[14.5px] font-bold text-primary-deep">Secured by Razorpay</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Clicking &ldquo;Pay securely&rdquo; opens Razorpay&apos;s checkout, where you can choose UPI, card,
              net banking, or a wallet. Your payment details are never seen or stored by this site.
            </p>
          </div>
        </div>
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

          {plan.offer && !useCoupon && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-dashed border-[#7BD3B0] bg-success-bg/60 px-4 py-3">
              <Tag className="size-4 text-success" />
              <div>
                <div className="text-[13.5px] font-extrabold text-success">{plan.offer.title}</div>
                <div className="text-[11.5px] text-muted-foreground">Applied automatically</div>
              </div>
            </div>
          )}

          <div className="mb-5">
            <label className="mb-2 block text-[12.5px] font-bold text-primary-deep">Coupon code</label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between gap-2.5 rounded-xl border border-dashed border-[#7BD3B0] bg-success-bg/60 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Tag className="size-4 shrink-0 text-success" />
                  <div>
                    <div className="text-[13.5px] font-extrabold text-success">
                      {appliedCoupon.couponCode} applied
                    </div>
                    <div className="text-[11.5px] text-muted-foreground">
                      {useCoupon
                        ? `− ₹${appliedCoupon.discountAmount.toLocaleString("en-IN")}`
                        : "Your current price already reflects a better offer."}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="shrink-0 text-[12.5px] font-bold text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2.5">
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="h-auto flex-1 rounded-xl px-4 py-3 text-sm"
                  />
                  <Button
                    variant="outline"
                    type="button"
                    disabled={!couponInput.trim() || validateCoupon.isPending}
                    onClick={handleApplyCoupon}
                  >
                    {validateCoupon.isPending ? "Checking…" : "Apply"}
                  </Button>
                </div>
                {couponError && <p className="mt-1.5 text-[12.5px] font-semibold text-destructive">{couponError}</p>}
              </>
            )}
          </div>

          <div className="flex flex-col gap-2.5 text-sm">
            <Row label={`${plan.plan_name} plan`} value={`₹${originalPrice.toLocaleString("en-IN")}`} />
            {discount > 0 && (
              <Row
                label={useCoupon ? `Coupon ${appliedCoupon.couponCode}` : "Offer discount"}
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
  // The gap between order-creation succeeding and the member finishing/
  // dismissing the Razorpay modal — neither mutation is "pending" during
  // that window, so isProcessing needs its own flag to stay disabled then.
  const [awaitingPayment, setAwaitingPayment] = useState(false);
  const isProcessing = initiate.isPending || confirm.isPending || awaitingPayment;

  const price = pkg ? Number(pkg.price) : 0;

  async function handlePay() {
    if (!pkg) return;
    try {
      const { purchase_id, payment_order } = await initiate.mutateAsync(pkg.id);

      if (!payment_order.orderId || !payment_order.keyId) {
        toast.error("Payment could not start. Please refresh and try again.");
        return;
      }

      // checkout.js loads async (afterInteractive) — it's normally ready
      // well before a member finishes reading this page, but give it a
      // moment rather than failing a perfectly good order outright.
      if (typeof window !== "undefined" && !window.Razorpay) {
        for (let attempt = 0; attempt < 20 && !window.Razorpay; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
      }
      if (typeof window === "undefined" || !window.Razorpay) {
        toast.error("Payment could not start. Please refresh and try again.");
        return;
      }

      setAwaitingPayment(true);
      const rzp = new window.Razorpay({
        key: payment_order.keyId,
        order_id: payment_order.orderId,
        amount: Math.round(payment_order.amount * 100),
        currency: payment_order.currency,
        name: "Parinayam",
        description: `${pkg.package_name} — Profile Highlight`,
        handler: (response) => {
          confirm
            .mutateAsync({
              purchaseId: purchase_id,
              razorpay: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            })
            .then(() => {
              router.push(`/checkout/success?highlight=${purchase_id}`);
            })
            .catch((error) => {
              toast.error(
                error instanceof ApiError ? error.message : "Payment could not be verified. Please contact support.",
              );
            })
            .finally(() => setAwaitingPayment(false));
        },
        modal: {
          // Member closed the Checkout modal without paying — never call
          // confirm, never navigate anywhere. The purchase stays PENDING.
          ondismiss: () => setAwaitingPayment(false),
        },
      });
      rzp.open();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Payment could not be completed. Please try again.");
      setAwaitingPayment(false);
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
