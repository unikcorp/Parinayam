import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PremiumBadgeProps {
  isPremium: boolean;
  className?: string;
}

// Formalizes the small gold badge that was previously inline in
// ProfileCard's `premium` prop — one component now, reused everywhere a
// listed member's premium status needs showing (search, interests,
// profile detail, recommendations), not re-implemented per screen.
export function PremiumBadge({ isPremium, className }: PremiumBadgeProps) {
  if (!isPremium) return null;

  return (
    <span
      className={cn(
        "bg-gold-gradient inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold tracking-wide text-white uppercase",
        className
      )}
    >
      <Star className="size-3 fill-current" /> Premium
    </span>
  );
}
