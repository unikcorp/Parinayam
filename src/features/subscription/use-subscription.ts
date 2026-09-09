import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import {
  confirmSubscriptionRequest,
  getMySubscriptionsRequest,
  initiateSubscriptionRequest,
} from "./api";
import type { RazorpayCheckoutResult } from "./types";

export function useMySubscriptions() {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: ["subscriptions", "my"],
    queryFn: getMySubscriptionsRequest,
    enabled: isAuthenticated && !isRestoring,
  });
}

export function useInitiateSubscription() {
  return useMutation({
    mutationFn: ({ planId, couponCode }: { planId: number; couponCode?: string }) =>
      initiateSubscriptionRequest(planId, couponCode),
  });
}

export function useConfirmSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subscriptionId, razorpay }: { subscriptionId: number; razorpay?: RazorpayCheckoutResult }) =>
      confirmSubscriptionRequest(subscriptionId, razorpay),
    onSuccess: () => {
      // The member's plan just changed — every screen reading useMembership()
      // (header Premium badge, plan page's "Current Plan", locked features)
      // needs the new entitlements, not the stale pre-purchase ones.
      queryClient.invalidateQueries({ queryKey: ["membership", "entitlements"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "my"] });
    },
  });
}
