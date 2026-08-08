"use client";

import { useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VoiceWaveProps {
  duration?: string;
  bars?: number;
  variant?: "self" | "other";
  className?: string;
}

export function VoiceWave({
  duration = "0:24",
  bars = 28,
  variant = "other",
  className,
}: VoiceWaveProps) {
  const [playing, setPlaying] = useState(false);
  const isSelf = variant === "self";
  const heights = useMemo(
    () =>
      Array.from({ length: bars }, (_, i) =>
        Math.max(4, Math.round(12 + 10 * Math.sin(i * 0.9) + 6 * Math.sin(i * 2.3)))
      ),
    [bars]
  );

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl px-4 py-3",
        isSelf ? "bg-primary text-white" : "bg-muted text-ink",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          isSelf ? "bg-white/20" : "bg-primary text-white"
        )}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause className="size-4" /> : <Play className="ml-0.5 size-4" />}
      </button>
      <div className="flex h-6 flex-1 items-center gap-[3px]">
        {heights.map((h, i) => (
          <span
            key={i}
            className={cn(
              "w-[3px] rounded-full",
              isSelf ? "bg-white/60" : "bg-faint"
            )}
            style={{ height: h }}
          />
        ))}
      </div>
      <span className={cn("text-xs font-semibold", isSelf ? "text-white/80" : "text-muted-foreground")}>
        {duration}
      </span>
    </div>
  );
}
