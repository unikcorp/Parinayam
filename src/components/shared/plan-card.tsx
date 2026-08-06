import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PlanCardProps {
  name: string;
  price: string;
  period?: string;
  tagline?: string;
  features: string[];
  highlighted?: boolean;
  dark?: boolean;
  badge?: string;
  ctaLabel?: string;
  onSelect?: () => void;
  className?: string;
}

export function PlanCard({
  name,
  price,
  period = "/month",
  tagline,
  features,
  highlighted,
  dark,
  badge,
  ctaLabel = "Choose plan",
  onSelect,
  className,
}: PlanCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-6 rounded-3xl p-7 transition-all duration-300 ease-out hover:-translate-y-2",
        dark
          ? "bg-dark-panel-gradient text-white shadow-[0_20px_48px_rgba(127,29,29,0.28)] hover:shadow-[0_28px_60px_rgba(127,29,29,0.38)]"
          : "border border-card-border bg-card hover:shadow-card-hover",
        highlighted && !dark && "border-primary shadow-card-hover",
        className
      )}
    >
      {badge && (
        <span className="bg-gold-gradient animate-pop absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-[11px] font-extrabold tracking-wide text-white uppercase shadow-cta-gold">
          {badge}
        </span>
      )}
      <div>
        <div
          className={cn(
            "text-base font-bold",
            dark ? "text-gold-light" : "text-primary-deep"
          )}
        >
          {name}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-extrabold">{price}</span>
          <span className={cn("text-sm", dark ? "text-white/60" : "text-muted-foreground")}>
            {period}
          </span>
        </div>
        {tagline && (
          <div className={cn("mt-1 text-sm", dark ? "text-white/60" : "text-muted-foreground")}>
            {tagline}
          </div>
        )}
      </div>
      <ul className="flex flex-1 flex-col gap-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <Check
              className={cn(
                "mt-0.5 size-4 shrink-0",
                dark ? "text-gold-light" : "text-success"
              )}
            />
            <span className={dark ? "text-white/85" : "text-foreground"}>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={onSelect}
        variant={dark ? "gold" : highlighted ? "default" : "outline"}
        size="cta"
        className="w-full"
      >
        {ctaLabel}
      </Button>
    </div>
  );
}
