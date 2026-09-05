import { cn } from "@/lib/utils";

export interface HighlightRibbonProps {
  isHighlighted: boolean;
  className?: string;
}

// Centered banner straddling a highlighted card's top edge — same "Featured"
// ribbon pattern other listing sites use, with the Highlight feature's own
// copy and gradient instead of a generic "Featured Profile" label.
export function HighlightRibbon({ isHighlighted, className }: HighlightRibbonProps) {
  if (!isHighlighted) return null;

  return (
    <span
      className={cn(
        "bg-highlight-badge-gradient absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full px-4 py-1 text-[11.5px] font-extrabold tracking-wide text-white shadow-md",
        className
      )}
    >
      Highlighted
    </span>
  );
}
