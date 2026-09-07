import { api } from "@/lib/api";

export interface ValidatedCoupon {
  couponCode: string;
  couponName: string;
  discountAmount: number;
  finalPrice: number;
}

export interface MyCoupon {
  code: string;
  name: string;
  description: string | null;
  discountType: "fixed" | "percentage";
  discountValue: number;
  maxDiscountAmount: number | null;
  validUntil: string;
  planNames: string[];
}

// Home-page coupon widget — every coupon currently assigned to and usable
// by the logged-in member, across all plans. Display only.
export function getMyCouponsRequest() {
  return api.get<MyCoupon[]>("/api/coupons/mine");
}

// The member types a code into checkout's "Enter coupon code" box — this is
// now the only way a coupon is ever applied, no auto-detection. Throws an
// ApiError (400) for any invalid/expired/exhausted/wrong-member code.
export function validateCouponCodeRequest(code: string, planId: number) {
  return api.post<ValidatedCoupon>("/api/coupons/validate", { code, planId });
}
