import type { ReactNode } from "react";
import { BadgeCheck, Star, Crown, Clock, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

function Pill({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap",
        className
      )}
    >
      {children}
    </span>
  );
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Pill className={cn("bg-blue-500 text-white", className)}>
      <BadgeCheck className="size-3.5" />
      Verified
    </Pill>
  );
}

export function PremiumBadge({ className }: { className?: string }) {
  return (
    <Pill
      className={cn(
        "bg-gold-gradient text-white tracking-wide uppercase",
        className
      )}
    >
      <Star className="size-3.5 fill-current" />
      Premium
    </Pill>
  );
}

export function EliteBadge({ className }: { className?: string }) {
  return (
    <Pill
      className={cn(
        "bg-primary-deep text-gold-light tracking-wide uppercase",
        className
      )}
    >
      <Crown className="size-3.5" />
      Elite
    </Pill>
  );
}

export function OnlineBadge({ className }: { className?: string }) {
  return (
    <Pill className={cn("bg-success-bg text-success", className)}>
      <span className="size-1.5 rounded-full bg-success" />
      Online now
    </Pill>
  );
}

export function RecentlyActiveBadge({ className }: { className?: string }) {
  return (
    <Pill className={cn("bg-peach-bg text-peach-text", className)}>
      <Clock className="size-3.5" />
      Recently active
    </Pill>
  );
}

export function NewMemberBadge({ className }: { className?: string }) {
  return (
    <Pill className={cn("bg-surface-blue text-primary", className)}>
      <Sparkles className="size-3.5" />
      New member
    </Pill>
  );
}

export function TrustBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  return (
    <Pill className={cn("bg-surface-cream-2 text-gold-text", className)}>
      <ShieldCheck className="size-3.5" />
      Trust score {score}
    </Pill>
  );
}

export function MatchBadge({
  percent,
  className,
}: {
  percent: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-primary-deep px-3.5 py-1.5 text-xs font-extrabold text-white",
        className
      )}
    >
      {percent}% match
    </span>
  );
}

export function OnlineDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "size-3 rounded-full border-2 border-white bg-success",
        className
      )}
    />
  );
}
