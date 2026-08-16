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

interface UploadPhotoResult {
  photoId: number;
  photoUrl: string;
}

export function useUploadProfilePhoto(memberId: number | null) {
  const invalidate = useInvalidateProfile();
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return api.post<UploadPhotoResult>(`/api/members/${memberId}/photos/profile`, form, { isFormData: true });
    },
    onSuccess: invalidate,
  });
}

export function useUploadGalleryPhoto(memberId: number | null) {
  const invalidate = useInvalidateProfile();
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return api.post<UploadPhotoResult>(`/api/members/${memberId}/photos/gallery`, form, { isFormData: true });
    },
    onSuccess: invalidate,
  });
}

// Replaces the image on an existing photo (profile or gallery) in place —
// goes back to PENDING for re-review, same as a fresh upload.
export function useUpdatePhoto(memberId: number | null) {
  const invalidate = useInvalidateProfile();
  return useMutation({
    mutationFn: ({ photoId, file }: { photoId: number; file: File }) => {
      const form = new FormData();
      form.append("file", file);
      return api.put<UploadPhotoResult>(`/api/members/${memberId}/photos/${photoId}`, form);
    },
    onSuccess: invalidate,
  });
}

// Works for either the profile photo or a gallery photo — both are rows in
// the same member_photos table on the server.
export function useDeletePhoto(memberId: number | null) {
  const invalidate = useInvalidateProfile();
  return useMutation({
    mutationFn: (photoId: number) => api.delete(`/api/members/${memberId}/photos/${photoId}`),
    onSuccess: invalidate,
  });
}

export type ContentVisibility = "ALL_MEMBERS" | "PREMIUM_MEMBERS" | "INTEREST_ACCEPTED";

export function useUpdatePrivacyPreferences() {
  const invalidate = useInvalidateProfile();
  return useMutation({
    mutationFn: (dto: {
      showInSearch: boolean;
      showOnlineStatus: boolean;
      photoVisibility: ContentVisibility;
      phoneVisibility: ContentVisibility;
    }) => api.put("/api/members/me/privacy", dto),
    onSuccess: invalidate,
  });
}
