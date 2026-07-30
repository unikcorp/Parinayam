import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterChipProps {
  children: React.ReactNode;
  active?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export function FilterChip({
  children,
  active,
  onRemove,
  onClick,
  className,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4.5 py-2 text-[13.5px] font-bold whitespace-nowrap transition-colors",
        active
          ? "bg-primary text-white"
          : "border border-input text-muted-foreground hover:border-primary hover:text-primary",
        className
      )}
    >
      {children}
      {active && onRemove && (
        <X
          className="size-3.5"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </button>
  );
}
