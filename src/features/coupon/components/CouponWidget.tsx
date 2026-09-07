"use client";

import Link from "next/link";
import { Gift } from "lucide-react";
import { useMyCoupons } from "../use-coupon";
import type { MyCoupon } from "../api";

function formatDiscount(coupon: MyCoupon): string {
  if (coupon.discountType === "fixed") {
    return `₹${coupon.discountValue.toLocaleString("en-IN")} off`;
  }
  const capped = coupon.maxDiscountAmount != null ? ` (up to ₹${coupon.maxDiscountAmount.toLocaleString("en-IN")})` : "";
  return `${coupon.discountValue}% off${capped}`;
}

function formatValidUntil(validUntil: string): string {
  return new Date(validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// Shown every time the member visits — a card per coupon currently
// assigned to them and still usable. Nothing renders while loading or when
// there's nothing to show, so it never takes up space unnecessarily.
// Reuses the site's own dark red gradient (same as the dashboard's "Good
// morning" banner) so it reads as part of this site, not a separate style.
export function CouponWidget() {
  const { data: coupons } = useMyCoupons();
  if (!coupons || coupons.length === 0) return null;

  return (
    <div className="bg-dark-panel-gradient rounded-[20px] p-5.5 text-white">
      <div className="mb-3.5 flex items-center gap-2 text-base font-extrabold">
        <Gift className="size-4.5" />
        Special offers for you
      </div>
      <div className="flex flex-col gap-3">
        {coupons.map((coupon) => (
          <div key={coupon.code} className="rounded-xl border border-white/20 bg-white/10 px-4 py-3.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[13.5px] font-extrabold">{coupon.name}</span>
              <span className="shrink-0 text-[13.5px] font-extrabold text-gold-light">{formatDiscount(coupon)}</span>
            </div>
            {coupon.planNames.length > 0 && (
              <div className="mt-1 text-[11.5px] text-white/70">Valid on {coupon.planNames.join(", ")}</div>
            )}
            <div className="mt-0.5 text-[11.5px] text-white/70">Use by {formatValidUntil(coupon.validUntil)}</div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <code className="rounded-md bg-white/15 px-2 py-1 text-[12px] font-bold tracking-wide">
                {coupon.code}
              </code>
              <Link href="/plans" className="text-[12.5px] font-bold text-white hover:underline">
                Use at checkout →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
