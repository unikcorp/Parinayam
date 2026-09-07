import { api } from "@/lib/api";
import type { InitiateSubscriptionResult, SubscriptionRecord } from "./types";

export function initiateSubscriptionRequest(planId: number, couponCode?: string) {
  return api.post<InitiateSubscriptionResult>("/api/subscriptions/initiate", { planId, couponCode });
}

export function confirmSubscriptionRequest(subscriptionId: number, gatewayPaymentId: string) {
  return api.post<SubscriptionRecord>("/api/subscriptions/confirm", { subscriptionId, gatewayPaymentId });
}

export function getMySubscriptionsRequest() {
  return api.get<SubscriptionRecord[]>("/api/subscriptions/my");
}
