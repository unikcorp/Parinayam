import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { useMembership } from "@/features/membership/use-membership";
import type { ProfileVisitorRecord, RecentlyViewedRecord } from "./types";

export function useRecentlyViewed() {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: ["recently-viewed"],
    queryFn: () => api.get<RecentlyViewedRecord[]>("/api/members/me/profile-views/recent"),
    enabled: isAuthenticated && !isRestoring,
  });
}

export function useProfileVisitorCount() {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: ["profile-visitor-count"],
    queryFn: () => api.get<{ count: number }>("/api/members/me/profile-views/visitor-count"),
    enabled: isAuthenticated && !isRestoring,
    select: (data) => data.count,
  });
}

// "Who Viewed Me" — gated behind canSeeWhoViewedMe; only fires once we
// know the member actually has that feature, since the backend 403s
// otherwise (the page itself still renders the locked state via
// useMembership() directly, this just avoids a doomed request).
export function useProfileVisitors() {
  const { isAuthenticated, isRestoring } = useAuth();
  const { isLoading: membershipLoading, canSeeWhoViewedMe } = useMembership();
  return useQuery({
    queryKey: ["profile-visitors"],
    queryFn: () => api.get<ProfileVisitorRecord[]>("/api/members/me/profile-views/visitors"),
    enabled: isAuthenticated && !isRestoring && !membershipLoading && canSeeWhoViewedMe,
  });
}
