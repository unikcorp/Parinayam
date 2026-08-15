import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import {
  addToShortlistRequest,
  getShortlistIncomingCountRequest,
  getShortlistRequest,
  removeFromShortlistRequest,
} from "./api";

const SHORTLIST_KEY = ["shortlist"];

export function useShortlist() {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: SHORTLIST_KEY,
    queryFn: getShortlistRequest,
    enabled: isAuthenticated && !isRestoring,
  });
}

// Derived from the same list query rather than a separate per-profile
// network call — the list is small (a member's own shortlist) and this way
// every star across the app (cards, profile page) shares one cache entry.
export function useIsShortlisted(memberId: number) {
  const { data } = useShortlist();
  return data?.some((r) => r.member_id === memberId) ?? false;
}

export function useShortlistedYouCount() {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: ["shortlist-incoming-count"],
    queryFn: getShortlistIncomingCountRequest,
    enabled: isAuthenticated && !isRestoring,
    select: (data) => data.count,
  });
}

export function useToggleShortlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, isShortlisted }: { memberId: number; isShortlisted: boolean }) =>
      isShortlisted ? removeFromShortlistRequest(memberId) : addToShortlistRequest(memberId),
    onSuccess: (_data, { isShortlisted }) => {
      toast.success(isShortlisted ? "Removed from shortlist." : "Added to shortlist.");
      queryClient.invalidateQueries({ queryKey: SHORTLIST_KEY });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
    },
  });
}
