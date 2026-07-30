import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface NotificationItemProps {
  icon: LucideIcon;
  tint?: "blue" | "peach" | "success" | "gold";
  title: React.ReactNode;
  time: string;
  unread?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  className?: string;
}

const tints: Record<NonNullable<NotificationItemProps["tint"]>, string> = {
  blue: "bg-surface-blue text-primary",
  peach: "bg-peach-bg text-peach-text",
  success: "bg-success-bg text-success",
  gold: "bg-surface-cream-2 text-gold-text",
};

export function NotificationItem({
  icon: Icon,
  tint = "peach",
  title,
  time,
  unread,
  onAccept,
  onDecline,
  className,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 rounded-2xl border border-card-border bg-card px-4.5 py-4",
        className
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          tints[tint]
        )}
      >
        <Icon className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-ink">{title}</div>
        <div className="mt-0.5 text-xs text-faint">{time}</div>
        {(onAccept || onDecline) && (
          <div className="mt-2.5 flex gap-2">
            {onAccept && (
              <Button size="sm" onClick={onAccept}>
                Accept
              </Button>
            )}
            {onDecline && (
              <Button size="sm" variant="outline" onClick={onDecline}>
                Decline
              </Button>
            )}
          </div>
        )}
      </div>
      {unread && <span className="size-2 shrink-0 rounded-full bg-primary" />}
    </div>
  );
}
