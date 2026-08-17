import { api } from "@/lib/api";
import type { InitiateSubscriptionResult, SubscriptionRecord } from "./types";

export function initiateSubscriptionRequest(planId: number) {
  return api.post<InitiateSubscriptionResult>("/api/subscriptions/initiate", { planId });
}

export function confirmSubscriptionRequest(subscriptionId: number, gatewayPaymentId: string) {
  return api.post<SubscriptionRecord>("/api/subscriptions/confirm", { subscriptionId, gatewayPaymentId });
}

export function getMySubscriptionsRequest() {
  return api.get<SubscriptionRecord[]>("/api/subscriptions/my");
}
