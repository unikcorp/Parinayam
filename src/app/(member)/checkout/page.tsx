"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Star, Tag, CreditCard, Landmark, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Method = "upi" | "card" | "netbanking" | "wallet";
const upiApps = ["GPay", "PhonePe", "Paytm", "Other UPI"];

export default function CheckoutPage() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("upi");
  const [upiApp, setUpiApp] = useState(upiApps[0]);
  const [upiId, setUpiId] = useState("anjali.menon@okhdfcbank");
  const [couponApplied, setCouponApplied] = useState(true);

  const planAmount = 5900;
  const discount = couponApplied ? 1180 : 0;
  const gst = Math.round((planAmount - discount) * 0.18);
  const total = planAmount - discount + gst;

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
        <MethodCard
          selected={method === "upi"}
          onSelect={() => setMethod("upi")}
          title="UPI"
          badge="Recommended · Instant"
        >
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
                      upiApp === app
                        ? "border-primary bg-[#FBFCFE] text-primary"
                        : "border-input text-muted-foreground"
                    )}
                  >
                    {app}
                  </button>
                ))}
              </div>
              <label className="mb-2 block text-[12.5px] font-bold text-primary-deep">
                UPI ID
              </label>
              <div className="flex gap-3">
                <Input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="h-auto flex-1 rounded-xl px-4 py-3.5 text-sm"
                />
                <Button>Verify</Button>
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
                <span
                  key={c}
                  className="rounded-md border border-input px-2.5 py-1 text-[10.5px] font-extrabold text-muted-foreground"
                >
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
          trailing={
            <span className="text-xs font-semibold text-faint">
              SBI, Federal, HDFC, ICICI +38
            </span>
          }
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
          <div className="mb-4.5 text-base font-extrabold text-primary-deep lg:text-[17px]">
            Order summary
          </div>
          <div className="mb-5 flex items-center gap-3.5 rounded-2xl bg-primary-deep p-4 text-white">
            <span className="bg-gold-gradient flex size-11 shrink-0 items-center justify-center rounded-xl">
              <Star className="size-[19px] fill-current" />
            </span>
            <div className="flex-1">
              <div className="text-[15px] font-extrabold">Premium — 6 months</div>
              <div className="mt-0.5 text-xs text-white/70">
                Renews 6 Jan 2027 · cancel anytime
              </div>
            </div>
          </div>

          {couponApplied ? (
            <div className="mb-5 flex items-center justify-between rounded-xl border border-dashed border-[#7BD3B0] bg-success-bg/60 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Tag className="size-4 text-success" />
                <div>
                  <div className="text-[13.5px] font-extrabold text-success">
                    FIRSTMATCH applied
                  </div>
                  <div className="text-[11.5px] text-muted-foreground">
                    20% off on first membership
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCouponApplied(false)}
                className="text-[12.5px] font-bold text-danger"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCouponApplied(true)}
              className="mb-5 w-full rounded-xl border border-dashed border-input py-3 text-[13px] font-bold text-primary"
            >
              Apply FIRSTMATCH coupon
            </button>
          )}

          <div className="flex flex-col gap-2.5 text-sm">
            <Row label="Premium 6-month plan" value={`₹${planAmount.toLocaleString("en-IN")}`} />
            {couponApplied && (
              <Row label="Coupon discount" value={`− ₹${discount.toLocaleString("en-IN")}`} tone="success" />
            )}
            <Row label="GST (18%)" value={`₹${gst.toLocaleString("en-IN")}`} />
            <div className="flex items-baseline justify-between border-t border-card-border pt-3.5">
              <span className="text-[15px] font-extrabold text-primary-deep">Total payable</span>
              <span className="text-2xl font-extrabold text-primary-deep">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <Button
            variant="gold"
            size="cta"
            className="mt-5.5 w-full"
            onClick={() => router.push("/checkout/success")}
          >
            Pay ₹{total.toLocaleString("en-IN")} securely
          </Button>
          <div className="mt-3 text-center text-xs text-faint">
            By paying you agree to the Terms &amp; Refund Policy. Invoice emailed instantly.
          </div>
        </div>

        <div className="hidden justify-center gap-5 text-[12.5px] font-semibold text-faint lg:flex">
          <span>🔒 PCI-DSS</span>
          <span>↩ 7-day refund</span>
          <span>🧾 GST invoice</span>
        </div>
      </aside>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success";
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-bold", tone === "success" ? "text-success" : "text-primary-deep")}>
        {value}
      </span>
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
        selected
          ? "border-2 border-primary shadow-[0_8px_26px_rgba(185,28,28,0.08)]"
          : "border-card-border",
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
        <span className="flex-1 text-left text-[15.5px] font-bold text-primary-deep">
          {title}
        </span>
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
