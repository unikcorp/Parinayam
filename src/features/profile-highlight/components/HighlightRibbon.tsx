import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HighlightRibbonProps {
  isHighlighted: boolean;
  className?: string;
  /**
   * Top-corner rounding, matched to the photo container's own radius. The
   * ribbon sits flush against that container's rounded top edge, so without
   * its own matching radius its square corners poke out past the curve
   * instead of following it.
   */
  radiusClassName?: string;
}

// Full-width banner across the top of the photo — mirrors the Flutter app's
// "Featured Profile" overlay treatment (a banner painted on the photo
// itself, rather than a pill straddling the card's outer edge) so the two
// clients read as the same design.
export function HighlightRibbon({ isHighlighted, className, radiusClassName }: HighlightRibbonProps) {
  if (!isHighlighted) return null;

  return (
    <div
      className={cn(
        "bg-highlight-badge-gradient absolute inset-x-0 top-0 z-10 flex items-center justify-center gap-1.5 py-1.5",
        radiusClassName,
        className
      )}
    >
      <Sparkles className="size-3 fill-current text-white" />
      <span className="text-[11px] font-extrabold tracking-wide text-white">Featured Profile</span>
    </div>
  );
}
