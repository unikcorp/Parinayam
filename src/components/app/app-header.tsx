"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Star } from "lucide-react";
import { brand } from "@/lib/brand.config";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "Matches", href: "/dashboard" },
  { label: "Search", href: "/search" },
  { label: "Inbox", href: "/inbox" },
];

export function AppHeader({ notificationCount = 4 }: { notificationCount?: number }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 hidden items-center justify-between border-b border-card-border bg-card px-12 py-3.5 lg:flex">
      <div className="flex items-center gap-10">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="bg-dark-panel-gradient flex size-9 items-center justify-center rounded-[11px] text-lg font-extrabold text-gold-light">
            {brand.logoLetter}
          </span>
          <span className="text-lg font-extrabold text-primary">{brand.name}</span>
        </Link>
        <nav className="flex gap-2 text-[14.5px] font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "rounded-[10px] px-4.5 py-2.5",
                pathname === link.href
                  ? "bg-surface-blue font-bold text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3.5">
        <span className="bg-gold-gradient inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold text-white">
          <Star className="size-3 fill-current" /> Premium
        </span>
        <Link
          href="/notifications"
          className="relative flex size-10.5 items-center justify-center rounded-xl border border-input bg-card"
        >
          <Bell className="size-4.5 text-primary-deep" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex min-w-4.5 items-center justify-center rounded-full bg-peach px-1 text-[10.5px] font-extrabold text-white">
              {notificationCount}
            </span>
          )}
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-2.5 rounded-full border border-input bg-card py-1.5 pr-2.5 pl-1.5"
        >
          <span className="flex size-8.5 items-center justify-center rounded-full bg-surface-blue text-xs font-bold text-primary">
            A
          </span>
          <span className="text-sm font-bold text-primary-deep">Anjali</span>
        </Link>
      </div>
    </header>
  );
}
