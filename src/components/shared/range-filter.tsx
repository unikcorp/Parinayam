"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface RangeFilterProps {
  label: string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  className?: string;
}

export function RangeFilter({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  className,
}: RangeFilterProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-xs font-bold tracking-wide text-faint uppercase">
          {label}
        </label>
        <span className="text-[13px] font-bold text-primary-deep">
          {value[0]}
          {unit} – {value[1]}
          {unit}
        </span>
      </div>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v as [number, number])}
      />
    </div>
  );
}
