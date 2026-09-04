import { api } from "@/lib/api";

export interface EligibleCouponOffer {
  planId: number;
  planName: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  couponCode: string;
  couponName: string;
}

export interface EligibleCouponForPlan {
  couponCode: string;
  couponName: string;
  discountAmount: number;
}

// Private/targeted — only ever resolved for the logged-in member from their
// own JWT, server-side. No coupon code is ever sent or typed by the client.
export function getMyEligibleCouponsRequest() {
  return api.get<EligibleCouponOffer[]>("/api/coupons/my-eligible");
}

export function getMyEligibleCouponForPlanRequest(planId: number) {
  return api.get<EligibleCouponForPlan | null>(`/api/coupons/my-eligible/${planId}`);
}
