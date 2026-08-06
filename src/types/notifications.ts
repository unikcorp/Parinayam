export type NotificationCategory = "interests" | "views" | "account";

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  icon: string;
  tint: "peach" | "blue" | "success" | "gold" | "danger";
  text: string;
  when: string;
  unread: boolean;
  actions?: "full" | "simple";
  emphasized?: boolean;
}

export interface NotificationGroup {
  label: string;
  items: NotificationItem[];
}
