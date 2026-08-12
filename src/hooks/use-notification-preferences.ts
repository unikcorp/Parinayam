import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const NOTIFICATION_CATEGORY_LABELS: Record<string, string> = {
  INTEREST_RECEIVED: "New interest received",
  INTEREST_ACCEPTED: "Interest accepted",
  NEW_MESSAGE: "New message",
  NEW_MATCH: "New match",
  PROFILE_VIEW: "Profile view",
  PHOTO_REQUEST: "Photo request",
  WEEKLY_MATCH_DIGEST: "Weekly match notification",
  MEMBERSHIP_PAYMENT: "Membership & payment",
};

export interface NotificationPreference {
  category: string;
  push: boolean;
  email: boolean;
  sms: boolean;
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ["notification-preferences"],
    queryFn: () => api.get<NotificationPreference[]>("/api/members/me/notification-preferences"),
  });
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ category, ...dto }: { category: string; push: boolean; email: boolean; sms: boolean }) =>
      api.put(`/api/members/me/notification-preferences/${category}`, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notification-preferences"] }),
  });
}
