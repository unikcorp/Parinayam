"use client";

import { cn } from "@/lib/utils";

export interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex w-fit gap-1 rounded-xl bg-muted p-1.5",
        className
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-lg px-5 py-2 text-[13.5px] font-bold transition-colors",
            value === opt.value
              ? "bg-card text-primary-deep shadow-[0_2px_8px_rgba(127,29,29,0.08)]"
              : "text-muted-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
