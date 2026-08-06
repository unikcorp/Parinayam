import { cn } from "@/lib/utils";

export interface StickyActionBarProps {
  children: React.ReactNode;
  className?: string;
}

export function StickyActionBar({ children, className }: StickyActionBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-card-border bg-card px-5 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_rgba(127,29,29,0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
}
