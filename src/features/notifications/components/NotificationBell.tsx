"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Camera,
  Check,
  CreditCard,
  Eye,
  Heart,
  MessageSquare,
  Star,
  ThumbsDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/format-time";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useUnreadNotifications,
} from "../use-notifications";
import type { NotificationRecord, NotificationType } from "../types";

// Purely presentational — which icon/tint represents a given type. The
// actual content (title, message, timestamp) always comes from the
// API/socket payload, never hardcoded here.
const TYPE_DISPLAY: Record<NotificationType, { icon: LucideIcon; tint: string }> = {
  interest_received: { icon: Heart, tint: "bg-peach-bg text-peach-text" },
  interest_accepted: { icon: Check, tint: "bg-success-bg text-success" },
  interest_rejected: { icon: ThumbsDown, tint: "bg-danger-bg text-danger" },
  new_message: { icon: MessageSquare, tint: "bg-surface-blue text-primary" },
  profile_viewed: { icon: Eye, tint: "bg-surface-cream-2 text-gold-text" },
  favorite_added: { icon: Star, tint: "bg-success-bg text-success" },
  profile_photo_approved: { icon: Camera, tint: "bg-success-bg text-success" },
  profile_photo_rejected: { icon: Camera, tint: "bg-danger-bg text-danger" },
  subscription_success: { icon: CreditCard, tint: "bg-surface-cream-2 text-gold-text" },
};

function NotificationRow({
  notification,
  onRead,
}: {
  notification: NotificationRecord;
  onRead: (id: number) => void;
}) {
  const { icon: Icon, tint } = TYPE_DISPLAY[notification.type];

  return (
    <button
      type="button"
      onClick={() => onRead(notification.id)}
      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface"
    >
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", tint)}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-bold text-primary-deep">{notification.title}</div>
        <div className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{notification.message}</div>
        <div className="mt-1 text-[11.5px] text-faint">{formatRelativeTime(notification.created_at)}</div>
      </div>
      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
    </button>
  );
}

export function NotificationBell() {
  const { data: notifications = [] } = useUnreadNotifications();
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();

  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex size-10.5 items-center justify-center rounded-xl border border-input bg-card"
      >
        <Bell className="size-4.5 text-primary-deep" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex min-w-4.5 items-center justify-center rounded-full bg-peach px-1 text-[10.5px] font-extrabold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-90 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-xl border border-card-border bg-card shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between border-b border-card-border px-4 py-3">
            <span className="text-sm font-extrabold text-primary-deep">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
                className="text-xs font-bold text-primary disabled:opacity-50"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-faint">You&apos;re all caught up.</p>
            ) : (
              notifications.map((n) => (
                <NotificationRow key={n.id} notification={n} onRead={(id) => markAsRead.mutate(id)} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
