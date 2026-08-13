import { api } from "@/lib/api";
import type { NotificationRecord } from "./types";

export function getUnreadNotificationsRequest() {
  return api.get<NotificationRecord[]>("/api/notifications/unread");
}

export function getRecentNotificationsRequest(page = 1, limit = 20) {
  return api.getPaginated<NotificationRecord[]>(`/api/notifications?page=${page}&limit=${limit}`);
}

export function markNotificationReadRequest(id: number) {
  return api.patch(`/api/notifications/${id}/read`);
}

export function markAllNotificationsReadRequest() {
  return api.patch("/api/notifications/read-all");
}
