"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, Search, Heart, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { key: "/dashboard", label: "Home", icon: Compass },
  { key: "/search", label: "Search", icon: Search },
  { key: "/inbox", label: "Inbox", icon: MessageCircle, badge: 2 },
  { key: "/profile", label: "Profile", icon: User },
] as const;

export function AppBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [left, right] = [items.slice(0, 2), items.slice(2)];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-card-border bg-card/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
      {left.map((item) => (
        <NavItem key={item.key} item={item} active={pathname === item.key} />
      ))}

      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        aria-label="Matches"
        className="bg-gold-gradient -mt-6.5 flex size-13.5 shrink-0 items-center justify-center rounded-full border-4 border-surface text-white shadow-cta-gold"
      >
        <Heart className="size-5.5 fill-current" />
      </button>

      {right.map((item) => (
        <NavItem key={item.key} item={item} active={pathname === item.key} />
      ))}
    </nav>
  );
}

function NavItem({
  item,
  active,
}: {
  item: (typeof items)[number];
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.key}
      className={cn(
        "relative flex flex-1 flex-col items-center gap-1 py-1.5 text-[11px] font-semibold",
        active ? "text-primary" : "text-faint"
      )}
    >
      <Icon className="size-5" />
      {item.label}
      {"badge" in item && item.badge && (
        <span className="absolute top-0.5 right-1/2 flex size-4 translate-x-3.5 items-center justify-center rounded-full bg-peach text-[9.5px] font-extrabold text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
