"use client";

import Link from "next/link";
import { Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionSkeleton } from "@/components/shared/loading-skeletons";
import { useHighlightHistory, useHighlightSummary } from "@/features/profile-highlight/use-profile-highlight";
import type { HighlightPurchase } from "@/features/profile-highlight/types";

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(`${value.replace(" ", "T")}Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function historyStatusClasses(status: HighlightPurchase["status"]) {
  switch (status) {
    case "ACTIVE":
      return "border-success/30 bg-success/10 text-success";
    case "PENDING":
      return "border-gold-light bg-gold-light/10 text-primary-deep";
    default:
      return "border-card-border bg-surface text-faint";
  }
}

export default function ProfileHighlightPage() {
  const { isActive, packageName, expiresAt, daysRemaining, isLoading, isError, refetch } = useHighlightSummary();
  const { data: history, isLoading: isHistoryLoading } = useHighlightHistory();

  return (
    <div className="flex flex-col gap-5.5">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep">Profile Highlight</h1>

      {isLoading && <SectionSkeleton />}

      {isError && !isLoading && (
        <div className="rounded-2xl border border-card-border bg-card p-7 text-center lg:rounded-[20px]">
          <p className="text-sm font-semibold text-destructive">Unable to load your Profile Highlight status.</p>
          <button onClick={() => refetch()} className="mt-3 text-sm font-bold text-primary underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {isActive ? (
            <section className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-highlight-badge-gradient px-3 py-1 text-[11px] font-extrabold text-white">
                  <Sparkles className="size-3.5" /> Highlighted
                </span>
                <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[11px] font-bold text-success">
                  Active
                </span>
              </div>
              <div className="mt-1 text-2xl font-extrabold text-primary-deep">{packageName}</div>
              <p className="mt-1 text-[13px] text-faint">
                Highlighted Until {formatDate(expiresAt)}
                {daysRemaining !== null && ` · ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining`}
              </p>
              <Link
                href="/plans/highlight"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
              >
                <Sparkles className="size-4" /> Extend Highlight
              </Link>
            </section>
          ) : (
            <section className="rounded-2xl border border-card-border bg-card p-7 text-center lg:rounded-[20px]">
              <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-highlight-badge-gradient">
                <Sparkles className="size-6 text-white" />
              </span>
              <div className="text-lg font-extrabold text-primary-deep">Make Your Profile Stand Out</div>
              <p className="mx-auto mt-1 max-w-sm text-sm text-faint">
                Highlight your profile and increase your visibility in search results and listings.
              </p>
              <Link
                href="/plans/highlight"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
              >
                View Highlight Packages
              </Link>
            </section>
          )}
        </>
      )}

      {/* History */}
      <div>
        <div className="mb-4 text-lg font-extrabold text-primary-deep">Highlight History</div>

        {isHistoryLoading && <SectionSkeleton />}

        {!isHistoryLoading && (!history || history.length === 0) && (
          <div className="rounded-2xl border border-dashed border-card-border bg-card p-8 text-center lg:rounded-[20px]">
            <p className="text-sm font-semibold text-ink">No Highlight history yet</p>
            <p className="mt-1 text-sm text-faint">Your purchases will show up here once you buy a Highlight.</p>
          </div>
        )}

        {!isHistoryLoading && history && history.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-card-border bg-card lg:rounded-[20px]">
            {history.map((row, i) => (
              <div
                key={row.id}
                className={cn(
                  "flex flex-wrap items-center justify-between gap-3 px-5 py-4",
                  i !== history.length - 1 && "border-b border-card-border"
                )}
              >
                <div>
                  <div className="text-sm font-extrabold text-primary-deep">{row.package_name_snapshot}</div>
                  <div className="mt-0.5 text-[12.5px] text-faint">
                    {row.started_at ? formatDate(row.started_at) : "Not started"} —{" "}
                    {row.expires_at ? formatDate(row.expires_at) : "—"}
                    {row.activated_by === "ADMIN" && " · Activated by admin"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink">
                    ₹{Number(row.paid_amount).toLocaleString("en-IN")}
                  </span>
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-bold", historyStatusClasses(row.status))}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px]">
        <div className="mb-3 text-sm font-extrabold text-primary-deep">Why highlight your profile?</div>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Check className="size-4 shrink-0 text-success" /> Rank higher in search results
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-4 shrink-0 text-success" /> Get noticed faster by prospective matches
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-4 shrink-0 text-success" /> Independent of your Membership Plan
          </li>
        </ul>
      </div>
    </div>
  );
}
