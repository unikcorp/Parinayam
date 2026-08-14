// Mirrors server/src/modules/notifications/notifications.types.ts — kept in
// sync by hand since the two projects don't share a types package.
export type NotificationType =
  | "interest_received"
  | "interest_accepted"
  | "interest_rejected"
  | "new_message"
  | "profile_viewed"
  | "favorite_added"
  | "profile_photo_approved"
  | "profile_photo_rejected"
  | "subscription_success";

export interface NotificationRecord {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}
