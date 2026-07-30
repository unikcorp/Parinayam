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

export const notificationGroups: NotificationGroup[] = [
  {
    label: "Today",
    items: [
      {
        id: "n1",
        category: "interests",
        icon: "♥",
        tint: "peach",
        text: 'Devika K sent you an interest — "Our families are from the same district!"',
        when: "12 min ago",
        unread: true,
        actions: "full",
        emphasized: true,
      },
      {
        id: "n2",
        category: "views",
        icon: "👁",
        tint: "blue",
        text: "Kiran P viewed your profile",
        when: "1 hr ago",
        unread: true,
        emphasized: true,
      },
      {
        id: "n3",
        category: "interests",
        icon: "✓",
        tint: "success",
        text: "Arjun N accepted your interest — you can now chat",
        when: "3 hr ago",
        unread: true,
        emphasized: true,
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        id: "n4",
        category: "account",
        icon: "🛡",
        tint: "success",
        text: "Your identity verification was approved. The verified badge is now live on your profile.",
        when: "Yesterday, 4:20 PM",
        unread: false,
      },
      {
        id: "n5",
        category: "interests",
        icon: "★",
        tint: "gold",
        text: "Sreejith M shortlisted your profile",
        when: "Yesterday, 11:05 AM",
        unread: false,
      },
    ],
  },
  {
    label: "Earlier this week",
    items: [
      {
        id: "n6",
        category: "account",
        icon: "⏳",
        tint: "danger",
        text: "Your Premium membership renews in 30 days. Renew early to keep priority placement.",
        when: "Tuesday",
        unread: false,
      },
      {
        id: "n7",
        category: "views",
        icon: "👁",
        tint: "blue",
        text: "6 members viewed your profile this week — see who they are",
        when: "Monday",
        unread: false,
      },
    ],
  },
];
