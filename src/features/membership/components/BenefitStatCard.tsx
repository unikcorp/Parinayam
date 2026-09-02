import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BenefitStatCardProps {
  label: string;
  used: number;
  limit: number | null;
  remaining: number | null;
  icon?: LucideIcon;
  className?: string;
}

// One card in the "Total Available Benefits" grid — the combined remaining
// balance across every currently-valid membership, with unlimited handled
// as its own state rather than a huge number.
export function BenefitStatCard({ label, used, limit, remaining, icon: Icon, className }: BenefitStatCardProps) {
  const isUnlimited = limit === null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-card-border bg-card p-5 transition-shadow hover:shadow-card-hover lg:rounded-[20px]",
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-[12.5px] font-bold tracking-wide text-faint uppercase">
        {Icon && <Icon className="size-3.5" />}
        {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold text-primary-deep">
        {isUnlimited ? "Unlimited" : remaining}
      </div>
      <p className="mt-1 text-[13px] text-faint">{isUnlimited ? "No limit on this plan" : `${used} used of ${limit}`}</p>
    </div>
  );
}
