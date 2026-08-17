import { cn } from "@/lib/utils";
import { useMembership } from "../use-membership";

export type UsageIndicatorType = "profileViews" | "contactViews" | "messages" | "interests";

const LABELS: Record<UsageIndicatorType, string> = {
  profileViews: "Profile views",
  contactViews: "Contact views",
  messages: "Messages",
  interests: "Interests",
};

export function UsageIndicator({ type, className }: { type: UsageIndicatorType; className?: string }) {
  const { limits, usage, isLoading } = useMembership();

  if (isLoading || !limits || !usage) {
    return <div className={cn("h-4 w-24 animate-pulse rounded bg-muted", className)} />;
  }

  const limit = limits[type];
  const used = usage[type];

  return (
    <div className={cn("text-xs font-semibold text-faint", className)}>
      {LABELS[type]}: <span className="text-primary-deep">{limit === null ? "Unlimited" : `${used} / ${limit} used`}</span>
    </div>
  );
}
