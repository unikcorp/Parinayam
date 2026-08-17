import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { getEntitlementsRequest } from "./api";

const ENTITLEMENTS_KEY = ["membership", "entitlements"];

function hasRemaining(limit: number | null, used: number): boolean {
  return limit === null || used < limit;
}

// The single source of truth for "what can this member do right now."
// Every component that needs membership info should use this hook only —
// never check a plan name or hardcode a limit directly.
export function useMembership() {
  const { isAuthenticated, isRestoring } = useAuth();

  const query = useQuery({
    queryKey: ENTITLEMENTS_KEY,
    queryFn: getEntitlementsRequest,
    enabled: isAuthenticated && !isRestoring,
  });

  const entitlements = query.data;

  return {
    entitlements,
    isLoading: isRestoring || query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,

    // Plan state — safe falsy defaults while loading/unauthenticated, never
    // assume premium/allowed by default.
    planName: entitlements?.planName ?? null,
    isPremium: entitlements?.isPremium ?? false,
    isActive: entitlements?.isActive ?? false,
    expiresAt: entitlements?.expiresAt ?? null,

    // Boolean feature flags, straight from the API.
    canUseChat: entitlements?.features.canUseChat ?? false,
    canUseAdvancedSearch: entitlements?.features.canUseAdvancedSearch ?? false,
    canSeeWhoViewedMe: entitlements?.features.canSeeWhoViewedMe ?? false,
    canUseProfileBoost: entitlements?.features.canUseProfileBoost ?? false,
    hasPriorityVisibility: entitlements?.features.hasPriorityVisibility ?? false,

    // Derived "do they have quota left" helpers — null limit = unlimited.
    canViewProfile: entitlements ? hasRemaining(entitlements.limits.profileViews, entitlements.usage.profileViews) : false,
    canViewContact: entitlements ? hasRemaining(entitlements.limits.contactViews, entitlements.usage.contactViews) : false,
    canSendMessage: entitlements ? hasRemaining(entitlements.limits.messages, entitlements.usage.messages) : false,
    canSendInterest: entitlements ? hasRemaining(entitlements.limits.interests, entitlements.usage.interests) : false,

    // Raw limits/usage for <UsageIndicator />.
    limits: entitlements?.limits ?? null,
    usage: entitlements?.usage ?? null,
  };
}
