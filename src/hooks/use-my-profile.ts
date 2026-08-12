import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import type { MemberProfileResponse } from "@/types/member-profile";

// Own-profile data for the Profile page, dashboard widgets, and Settings —
// only fetched once a session is actually restored, since /api/members/me
// 404s for a logged-out request.
export function useMyProfile() {
  const { isAuthenticated, isRestoring } = useAuth();

  return useQuery({
    queryKey: ["my-profile"],
    queryFn: () => api.get<MemberProfileResponse>("/api/members/me"),
    enabled: isAuthenticated && !isRestoring,
  });
}

function useInvalidateProfile() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["my-profile"] });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (dto: { currentPassword: string; newPassword: string }) =>
      api.put("/api/members/me/password", dto),
  });
}

export function useLogoutOtherDevices() {
  return useMutation({
    mutationFn: () => api.post("/api/members/me/logout-other-devices"),
  });
}

export function useUpdateAccountStatus() {
  const invalidate = useInvalidateProfile();
  return useMutation({
    mutationFn: (accountStatus: "ACTIVE" | "INACTIVE") =>
      api.put("/api/members/me/account-status", { accountStatus }),
    onSuccess: invalidate,
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) => api.post("/api/members/me/delete", { password }),
  });
}

export function useUpdatePrivacyPreferences() {
  const invalidate = useInvalidateProfile();
  return useMutation({
    mutationFn: (dto: { showInSearch: boolean; showOnlineStatus: boolean }) =>
      api.put("/api/members/me/privacy", dto),
    onSuccess: invalidate,
  });
}
