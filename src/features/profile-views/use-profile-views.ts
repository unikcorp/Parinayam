import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import type { RecentlyViewedRecord } from "./types";

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
