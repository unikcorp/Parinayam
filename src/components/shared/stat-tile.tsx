import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tint?: "blue" | "peach" | "success" | "gold";
  className?: string;
}

const tints: Record<NonNullable<StatTileProps["tint"]>, string> = {
  blue: "bg-surface-blue text-primary",
  peach: "bg-peach-bg text-peach-text",
  success: "bg-success-bg text-success",
  gold: "bg-surface-cream-2 text-gold-text",
};

export function StatTile({
  icon: Icon,
  label,
  value,
  tint = "blue",
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-card-border bg-card p-5",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-xl",
          tints[tint]
        )}
      >
        <Icon className="size-5" />
      </span>
      <div>
        <div className="text-2xl font-extrabold text-primary-deep">{value}</div>
        <div className="mt-0.5 text-[13px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
