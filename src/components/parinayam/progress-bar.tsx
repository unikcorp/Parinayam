import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  percent: number;
  variant?: "success" | "gold" | "primary";
  label?: string;
  valueLabel?: string;
  trackClassName?: string;
  className?: string;
}

const fills: Record<NonNullable<ProgressBarProps["variant"]>, string> = {
  success: "bg-progress-success-gradient",
  gold: "bg-progress-gold-gradient",
  primary: "bg-primary",
};

export function ProgressBar({
  percent,
  variant = "primary",
  label,
  valueLabel,
  trackClassName,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className={cn("w-full", className)}>
      {(label || valueLabel) && (
        <div className="mb-2 flex items-center justify-between text-[13px] font-bold">
          <span className="text-primary-deep">{label}</span>
          <span className="text-success">{valueLabel}</span>
        </div>
      )}
      <div
        className={cn(
          "h-2.5 w-full overflow-hidden rounded-full bg-muted",
          trackClassName
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700 ease-out",
            fills[variant]
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
