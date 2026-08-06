import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  innerBg?: string;
  label?: ReactNode;
  sublabel?: string;
  className?: string;
}

export function ProgressRing({
  percent,
  size = 128,
  strokeWidth = 10,
  color = "#B91C1C",
  trackColor = "#EEF0F4",
  innerBg,
  label,
  sublabel,
  className,
}: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full transition-[background] duration-700 ease-out"
        style={{
          background: `conic-gradient(${color} ${clamped * 3.6}deg, ${trackColor} 0deg)`,
        }}
      />
      <div
        className={cn("absolute rounded-full", !innerBg && "bg-card")}
        style={{
          inset: strokeWidth,
          background: innerBg,
        }}
      />
      <div className="relative flex flex-col items-center justify-center">
        {label ?? (
          <span className="text-2xl font-extrabold text-primary-deep">
            {clamped}%
          </span>
        )}
        {sublabel && (
          <span className="mt-0.5 text-[11px] font-semibold text-muted-foreground">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
