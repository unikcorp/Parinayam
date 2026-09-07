import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { getMyCouponsRequest, validateCouponCodeRequest } from "./api";

// The home-page coupon widget — refetched on every visit/focus (default
// React Query behavior) so a coupon assigned mid-session (or one that just
// expired) is never stale for long.
export function useMyCoupons() {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: ["coupons", "mine"],
    queryFn: getMyCouponsRequest,
    enabled: isAuthenticated && !isRestoring,
  });
}

// Checkout's "Apply" button — validates a typed coupon code against the
// plan being purchased. Display-only: the actual charged amount is always
// independently recomputed server-side when the purchase is initiated.
export function useValidateCouponCode() {
  return useMutation({
    mutationFn: ({ code, planId }: { code: string; planId: number }) => validateCouponCodeRequest(code, planId),
  });
}
