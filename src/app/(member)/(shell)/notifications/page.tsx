"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/shared/filter-chip";
import { cn } from "@/lib/utils";
import type { NotificationCategory, NotificationGroup } from "@/types/notifications";
import { useNotifications } from "@/hooks/use-notifications";

const filters: { label: string; value: "all" | NotificationCategory }[] = [
  { label: "All", value: "all" },
  { label: "Interests", value: "interests" },
  { label: "Views", value: "views" },
  { label: "Account", value: "account" },
];

const tintClasses: Record<string, string> = {
  peach: "bg-peach-bg text-peach-text",
  blue: "bg-surface-blue text-primary",
  success: "bg-success-bg text-success",
  gold: "bg-surface-cream-2 text-gold-text",
  danger: "bg-danger-bg text-danger",
};

export default function NotificationsPage() {
  const { data: groups = [] } = useNotifications();
  const [filter, setFilter] = useState<"all" | NotificationCategory>("all");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  function markAllRead() {
    setReadIds(new Set(groups.flatMap((g: NotificationGroup) => g.items.map((n) => n.id))));
  }

  const visibleGroups = groups
    .map((g) => ({
      ...g,
      items: g.items
        .filter((n) => filter === "all" || n.category === filter)
        .map((n) => (readIds.has(n.id) ? { ...n, unread: false } : n)),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-215">
      {/* mobile header */}
      <header className="sticky top-0 z-10 border-b border-card-border bg-card px-5 pt-4 pb-3 lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex size-9.5 items-center justify-center rounded-[10px] bg-muted text-primary-deep"
            >
              <ChevronLeft className="size-4" />
            </Link>
            <div className="text-lg font-extrabold text-primary-deep">Notifications</div>
          </div>
          <button
            type="button"
            onClick={markAllRead}
            className="text-[12.5px] font-bold text-primary"
          >
            Mark all read
          </button>
        </div>
        <div className="pn-scroll-x flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((f) => (
            <FilterChip
              key={f.value}
              active={filter === f.value}
              onClick={() => setFilter(f.value)}
              className="shrink-0 px-4 py-2 text-[12.5px]"
            >
              {f.label}
            </FilterChip>
          ))}
        </div>
      </header>

      <div className="px-5 py-6 lg:px-6 lg:py-9">
        {/* desktop header */}
        <div className="mb-5 hidden items-center justify-between lg:flex">
          <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-primary-deep">
            Notifications
          </h1>
          <Button variant="outline" onClick={markAllRead}>
            Mark all as read
          </Button>
        </div>
        <div className="mb-7 hidden gap-2 lg:flex">
          {filters.map((f) => (
            <FilterChip
              key={f.value}
              active={filter === f.value}
              onClick={() => setFilter(f.value)}
              className="px-4.5 py-2.25 text-[13px]"
            >
              {f.label}
            </FilterChip>
          ))}
        </div>

        {visibleGroups.length === 0 && (
          <p className="py-16 text-center text-sm text-faint">
            No notifications in this category.
          </p>
        )}

        {visibleGroups.map((group) => (
          <section key={group.label} className="mb-2">
            <div className="mt-6 mb-2.5 text-xs font-extrabold tracking-[0.08em] text-faint uppercase lg:mt-6.5 lg:mb-3.5">
              {group.label}
            </div>
            <div className="flex flex-col gap-2.5 lg:gap-0 lg:overflow-hidden lg:rounded-[20px] lg:border lg:border-card-border lg:bg-card">
              {group.items.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3.5 rounded-2xl border border-card-border p-3.5 lg:gap-4 lg:rounded-none lg:border-x-0 lg:border-t lg:border-b-0 lg:px-6 lg:py-4.5 lg:first:border-t-0",
                    n.emphasized ? "bg-[#FBFCFE]" : "bg-card"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9.5 shrink-0 items-center justify-center rounded-full text-base lg:size-11 lg:text-lg",
                      tintClasses[n.tint]
                    )}
                  >
                    {n.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] leading-[1.5] text-ink lg:text-[14.5px]">
                      {n.text}
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-faint lg:mt-1 lg:text-xs">
                      {n.when}
                    </div>
                    {n.actions && (
                      <div className="mt-2.5 flex gap-2 lg:mt-3">
                        <Button size="sm" className="flex-1 bg-success hover:bg-success/90 lg:flex-none">
                          ✓ Accept
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                          Decline
                        </Button>
                        {n.actions === "full" && (
                          <Button variant="secondary" size="sm" className="hidden lg:inline-flex">
                            View profile
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  {n.unread && (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary lg:mt-2 lg:size-2.5" />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
