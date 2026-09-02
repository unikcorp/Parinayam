import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { getMembershipSummaryRequest } from "./summary-api";

const MEMBERSHIP_SUMMARY_KEY = ["membership", "summary"];

// The "My Membership" page's data source — the combined benefits plus the
// per-plan contribution breakdown behind them. Unlike useMembership(), this
// is only for that one page (display/detail), not for gating features.
export function useMembershipSummary() {
  const { isAuthenticated, isRestoring } = useAuth();

  const query = useQuery({
    queryKey: MEMBERSHIP_SUMMARY_KEY,
    queryFn: getMembershipSummaryRequest,
    enabled: isAuthenticated && !isRestoring,
  });

  return {
    summary: query.data,
    isLoading: isRestoring || query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
