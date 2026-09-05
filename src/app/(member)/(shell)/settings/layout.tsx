"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Lock,
  Bell,
  Ban,
  KeyRound,
  Star,
  Trophy,
  Sparkles,
  MessageCircle,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SettingsNavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  color: string;
  bg: string;
  gradientBorder?: string;
};

function IconChip({ item }: { item: SettingsNavItem }) {
  const icon = <item.icon className={cn("size-[17px]", item.color)} />;
  if (item.gradientBorder) {
    return (
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br p-[2px]",
          item.gradientBorder
        )}
      >
        <span className={cn("flex size-full items-center justify-center rounded-[7px]", item.bg)}>{icon}</span>
      </span>
    );
  }
  return (
    <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", item.bg)}>{icon}</span>
  );
}

const settingsNav: SettingsNavItem[] = [
  { href: "/settings", icon: User, label: "Profile Settings", color: "text-blue-600", bg: "bg-blue-50" },
  { href: "/settings/privacy", icon: Lock, label: "Privacy & Visibility", color: "text-purple-600", bg: "bg-purple-50" },
  { href: "/settings/notifications", icon: Bell, label: "Notifications", color: "text-amber-600", bg: "bg-amber-50" },
  { href: "/settings/blocked", icon: Ban, label: "Blocked Users", color: "text-danger", bg: "bg-danger-bg" },
  { href: "/settings/security", icon: KeyRound, label: "Password & Security", color: "text-emerald-600", bg: "bg-emerald-50" },
  { href: "/settings/billing", icon: Star, label: "Membership & Billing", color: "text-gold-text", bg: "bg-[#fdf1e2]" },
  { href: "/settings/membership", icon: Trophy, label: "My Membership", color: "text-orange-600", bg: "bg-orange-50" },
  { href: "/settings/profile-highlight", icon: Sparkles, label: "Profile Highlight", color: "text-rose-600", bg: "bg-rose-50" },
  { href: "/settings/support", icon: MessageCircle, label: "Report a Problem", color: "text-sky-600", bg: "bg-sky-50" },
  { href: "/settings/account", icon: TriangleAlert, label: "Account", color: "text-destructive", bg: "bg-danger-bg" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="lg:mx-auto lg:grid lg:max-w-[1240px] lg:grid-cols-[280px_1fr] lg:items-start lg:gap-7 lg:px-12 lg:py-8">
      {/* MOBILE HEADER */}
      <header className="flex items-center gap-3 border-b border-card-border bg-card px-5 py-4 lg:hidden">
        <Link
          href="/dashboard"
          className="flex size-9.5 items-center justify-center rounded-[10px] bg-muted text-primary-deep"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div className="text-lg font-extrabold text-primary-deep">Settings</div>
      </header>

      {/* DESKTOP SIDE NAV */}
      <aside className="sticky top-6 hidden flex-col gap-1 rounded-[20px] border border-card-border bg-card p-4 lg:flex">
        {settingsNav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3.5 text-[14.5px]",
                active
                  ? "bg-surface-blue font-bold text-primary"
                  : "font-semibold text-muted-foreground hover:bg-surface"
              )}
            >
              <IconChip item={item} />
              {item.label}
            </Link>
          );
        })}
      </aside>

      {/* MOBILE NAV LIST (shown only on the settings index) */}
      {pathname === "/settings" && (
        <nav className="overflow-hidden rounded-2xl border border-card-border bg-card lg:hidden">
          {settingsNav.slice(1).map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 border-b border-[#F5F6F9] px-4.5 py-4",
                i === settingsNav.length - 2 && "border-b-0"
              )}
            >
              <IconChip item={item} />
              <span className="flex-1 text-sm font-bold text-ink">{item.label}</span>
              <ChevronRight className="size-4 text-faint" />
            </Link>
          ))}
        </nav>
      )}

      <main className="px-5 py-5 lg:px-0 lg:py-0">{children}</main>
    </div>
  );
}
