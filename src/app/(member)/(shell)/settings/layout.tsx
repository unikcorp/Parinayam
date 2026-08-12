"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsNav = [
  { href: "/settings", icon: "👤", label: "Profile Settings" },
  { href: "/settings/privacy", icon: "🔒", label: "Privacy & Visibility" },
  { href: "/settings/notifications", icon: "🔔", label: "Notifications" },
  { href: "/settings/blocked", icon: "🚫", label: "Blocked Users" },
  { href: "/settings/security", icon: "🔑", label: "Password & Security" },
  { href: "/settings/billing", icon: "★", label: "Membership & Billing" },
  { href: "/settings/account", icon: "⚠", label: "Account" },
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
              <span className="text-base">{item.icon}</span> {item.label}
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
              <span className="text-base">{item.icon}</span>
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
