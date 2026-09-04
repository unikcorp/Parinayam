import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import {
  confirmHighlightPurchaseRequest,
  getHighlightHistoryRequest,
  getHighlightPackagesRequest,
  getHighlightStatusRequest,
  initiateHighlightPurchaseRequest,
} from "./api";

// Public — no auth needed, so unauthenticated visitors browsing packages
// (e.g. the checkout page opened directly) don't get stuck loading forever.
export function useHighlightPackages() {
  return useQuery({
    queryKey: ["profile-highlight", "packages"],
    queryFn: getHighlightPackagesRequest,
  });
}

// Current highlight status — the single source of truth for "is my profile
// highlighted right now." Backend re-checks expires_at live against NOW()
// on every call, never trusts a stale stored flag.
export function useHighlightStatus() {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: ["profile-highlight", "status"],
    queryFn: getHighlightStatusRequest,
    enabled: isAuthenticated && !isRestoring,
  });
}

export function useHighlightHistory() {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: ["profile-highlight", "history"],
    queryFn: getHighlightHistoryRequest,
    enabled: isAuthenticated && !isRestoring,
  });
}

export function useInitiateHighlightPurchase() {
  return useMutation({
    mutationFn: (packageId: number) => initiateHighlightPurchaseRequest(packageId),
  });
}

export function useConfirmHighlightPurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ purchaseId, gatewayPaymentId }: { purchaseId: number; gatewayPaymentId: string }) =>
      confirmHighlightPurchaseRequest(purchaseId, gatewayPaymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-highlight", "status"] });
      queryClient.invalidateQueries({ queryKey: ["profile-highlight", "history"] });
    },
  });
}

function daysRemaining(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const ms = new Date(`${expiresAt.replace(" ", "T")}Z`).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

// Convenience summary for the status card — mirrors useMembershipSummary's
// shape (isActive/expiresAt/daysRemaining) but scoped to Profile Highlight,
// a feature deliberately independent of Membership.
export function useHighlightSummary() {
  const { data: active, isLoading, isError, refetch } = useHighlightStatus();
  return {
    isActive: !!active,
    packageName: active?.package_name_snapshot ?? null,
    expiresAt: active?.expires_at ?? null,
    daysRemaining: daysRemaining(active?.expires_at ?? null),
    isLoading,
    isError,
    refetch,
  };
}
