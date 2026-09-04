import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { getMyEligibleCouponForPlanRequest, getMyEligibleCouponsRequest } from "./api";

// Every plan the logged-in member currently has a private, eligible coupon
// for — drives the "🎁 you have a special offer" banner on the Plans page.
export function useMyEligibleCoupons() {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: ["coupons", "my-eligible"],
    queryFn: getMyEligibleCouponsRequest,
    enabled: isAuthenticated && !isRestoring,
  });
}

// Single-plan variant for the checkout page — display only; the actual
// charged amount always comes from the initiate/confirm response.
export function useMyEligibleCouponForPlan(planId: number | null) {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: ["coupons", "my-eligible", planId],
    queryFn: () => getMyEligibleCouponForPlanRequest(planId as number),
    enabled: isAuthenticated && !isRestoring && planId != null && Number.isFinite(planId),
  });
}
