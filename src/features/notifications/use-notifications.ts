import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import {
  getUnreadNotificationsRequest,
  markAllNotificationsReadRequest,
  markNotificationReadRequest,
} from "./api";

export const UNREAD_NOTIFICATIONS_KEY = ["notifications", "unread"];

// The REST fallback every session reconciles against on load/reconnect —
// the socket is only ever a live-delivery shortcut on top of this, never
// the source of truth. Same gating as useMyProfile: don't fire before the
// session has actually restored, since the endpoint 404s for a logged-out request.
export function useUnreadNotifications() {
  const { isAuthenticated, isRestoring } = useAuth();

  return useQuery({
    queryKey: UNREAD_NOTIFICATIONS_KEY,
    queryFn: getUnreadNotificationsRequest,
    enabled: isAuthenticated && !isRestoring,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => markNotificationReadRequest(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Awaited<ReturnType<typeof getUnreadNotificationsRequest>>>(
        UNREAD_NOTIFICATIONS_KEY,
        (old) => old?.filter((n) => n.id !== id) ?? old,
      );
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsReadRequest(),
    onSuccess: () => {
      queryClient.setQueryData(UNREAD_NOTIFICATIONS_KEY, []);
    },
  });
}
