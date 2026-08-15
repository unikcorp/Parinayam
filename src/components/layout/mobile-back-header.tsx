"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Mobile-only back header for drill-in pages that aren't one of the bottom
// nav's own tabs (desktop already has the persistent AppHeader nav, so this
// stays lg:hidden) — mirrors the pattern already used by Settings/Notifications.
export function MobileBackHeader({
  title,
  href,
  right,
  className,
}: {
  title: string;
  /** Fixed destination — omit to use browser history (router.back()) instead, for pages reachable from more than one place. */
  href?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const backButtonClass = "flex size-9.5 shrink-0 items-center justify-center rounded-[10px] bg-muted text-primary-deep";

  return (
    <header className={cn("flex items-center gap-3 border-b border-card-border bg-card px-5 py-4 lg:hidden", className)}>
      {href ? (
        <Link href={href} className={backButtonClass} aria-label="Back">
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <button type="button" onClick={() => router.back()} className={backButtonClass} aria-label="Back">
          <ChevronLeft className="size-4" />
        </button>
      )}
      <div className="flex-1 truncate text-lg font-extrabold text-primary-deep">{title}</div>
      {right}
    </header>
  );
}
