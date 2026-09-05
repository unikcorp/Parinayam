import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HighlightBadgeProps {
  isHighlighted: boolean;
  className?: string;
}

// Distinct from PremiumBadge — Profile Highlight is a separate, independent
// paid feature from Membership, so it gets its own badge/copy rather than
// reusing or being confused with the premium one.
export function HighlightBadge({ isHighlighted, className }: HighlightBadgeProps) {
  if (!isHighlighted) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-highlight-badge-gradient px-2.5 py-1 text-[10.5px] font-extrabold tracking-wide text-white uppercase",
        className
      )}
    >
      <Sparkles className="size-3 fill-current" /> Highlighted
    </span>
  );
}
