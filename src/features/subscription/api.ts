import { api } from "@/lib/api";
import type { InitiateSubscriptionResult, RazorpayCheckoutResult, SubscriptionRecord } from "./types";

export function initiateSubscriptionRequest(planId: number, couponCode?: string) {
  return api.post<InitiateSubscriptionResult>("/api/subscriptions/initiate", { planId, couponCode });
}

// razorpay is omitted entirely for a ₹0 subscription (Free plan, or a
// 100%-discount coupon/offer) — the server's own paid_amount===0 branch
// activates it with no gateway involved at all.
export function confirmSubscriptionRequest(subscriptionId: number, razorpay?: RazorpayCheckoutResult) {
  return api.post<SubscriptionRecord>("/api/subscriptions/confirm", {
    subscriptionId,
    razorpayOrderId: razorpay?.orderId,
    razorpayPaymentId: razorpay?.paymentId,
    razorpaySignature: razorpay?.signature,
  });
}

export function getMySubscriptionsRequest() {
  return api.get<SubscriptionRecord[]>("/api/subscriptions/my");
}
