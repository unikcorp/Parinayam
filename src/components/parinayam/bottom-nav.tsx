"use client";

import type { LucideIcon } from "lucide-react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BottomNavItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

export interface BottomNavProps {
  items: [BottomNavItem, BottomNavItem, BottomNavItem, BottomNavItem];
  active: string;
  onChange: (key: string) => void;
  onFabClick?: () => void;
  className?: string;
}

export function BottomNav({ items, active, onChange, onFabClick, className }: BottomNavProps) {
  const [a, b, c, d] = items;
  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-card-border bg-card px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]",
        className
      )}
    >
      <NavButton item={a} active={active === a.key} onClick={() => onChange(a.key)} />
      <NavButton item={b} active={active === b.key} onClick={() => onChange(b.key)} />

      <button
        type="button"
        onClick={onFabClick}
        aria-label="Quick actions"
        className="bg-gold-gradient -mt-7 flex size-14 shrink-0 items-center justify-center rounded-full text-white shadow-cta-gold"
      >
        <Heart className="size-6 fill-current" />
      </button>

      <NavButton item={c} active={active === c.key} onClick={() => onChange(c.key)} />
      <NavButton item={d} active={active === d.key} onClick={() => onChange(d.key)} />
    </nav>
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: BottomNavItem;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 py-1.5 text-[11px] font-semibold",
        active ? "text-primary" : "text-faint"
      )}
    >
      <Icon className="size-5" />
      {item.label}
    </button>
  );
}
