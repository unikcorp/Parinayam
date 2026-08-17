"use client";

import { useRouter } from "next/navigation";
import { Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface UpgradePromptProps {
  /** The feature name to display, e.g. "Who Viewed Me" or "Advanced Search". */
  feature: string;
  message?: string;
  className?: string;
}

// The one shared "this is locked" UI — used everywhere a feature or limit
// blocks a Free/lower-tier member, instead of each flow building its own.
export function UpgradePrompt({ feature, message, className }: UpgradePromptProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gold-light bg-surface-cream-2 p-6 text-center",
        className
      )}
    >
      <span className="bg-gold-gradient flex size-11 items-center justify-center rounded-full text-white">
        <Lock className="size-5" />
      </span>
      <div>
        <div className="text-[15px] font-extrabold text-primary-deep">{feature} is a Premium feature</div>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {message ?? `Upgrade your plan to unlock ${feature}.`}
        </p>
      </div>
      <Button variant="gold" size="sm" onClick={() => router.push("/plans")}>
        <Star className="size-3.5 fill-current" /> Upgrade Now
      </Button>
    </div>
  );
}
