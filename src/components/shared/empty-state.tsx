import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-input p-8 text-center",
        className
      )}
    >
      <span className="mb-3 flex size-13 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5.5 text-faint" />
      </span>
      <div className="text-[15px] font-bold text-primary-deep">{title}</div>
      {description && (
        <div className="mt-1.5 mb-3.5 text-[13px] text-faint">{description}</div>
      )}
      {actionLabel && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
