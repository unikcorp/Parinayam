"use client";

import Link from "next/link";
import { AlertTriangle, Eye, Heart, MessageCircle, Phone, Check, Lock, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PremiumBadge } from "@/features/membership/components/PremiumBadge";
import { BenefitStatCard } from "@/features/membership/components/BenefitStatCard";
import { ContributionCard } from "@/features/membership/components/ContributionCard";
import { useMembershipSummary } from "@/features/membership/use-membership-summary";
import { useMySubscriptions } from "@/features/subscription/use-subscription";
import { NUMERIC_FEATURE_KEYS, NUMERIC_FEATURE_LABELS } from "@/features/membership/summary-types";
import { SectionSkeleton } from "@/components/shared/loading-skeletons";
import { cn } from "@/lib/utils";
import type { SubscriptionRecord } from "@/features/subscription/types";

const NUMERIC_FEATURE_ICONS = {
  profileViews: Eye,
  contactViews: Phone,
  messages: MessageCircle,
  interests: Heart,
} as const;

const PREMIUM_FEATURES = [
  { key: "canUseChat", label: "In-App Chat" },
  { key: "canUseAdvancedSearch", label: "Advanced Search" },
  { key: "canSeeWhoViewedMe", label: "Who Viewed My Profile" },
  { key: "canUseProfileBoost", label: "Profile Boost" },
  { key: "hasPriorityVisibility", label: "Priority Visibility" },
] as const;

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value.replace(" ", "T") + "Z").toLocaleDateString("en-IN");
}

function historyStatusClasses(status: SubscriptionRecord["status"]) {
  switch (status) {
    case "ACTIVE":
      return "border-success/30 bg-success/10 text-success";
    case "PENDING":
      return "border-gold-light bg-gold-light/10 text-primary-deep";
    default:
      return "border-card-border bg-surface text-faint";
  }
}

export default function MyMembershipPage() {
  const { summary, isLoading, isError, refetch } = useMembershipSummary();
  const { data: history, isLoading: isHistoryLoading } = useMySubscriptions();

  const expiringContributions = summary?.contributions.filter((c) => c.isExpiringSoon) ?? [];

  return (
    <div className="flex flex-col gap-5.5">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep">My Membership</h1>

      {isLoading && <SectionSkeleton />}

      {isError && !isLoading && (
        <div className="rounded-2xl border border-card-border bg-card p-7 text-center lg:rounded-[20px]">
          <p className="text-sm font-semibold text-destructive">Unable to load your membership details.</p>
          <button onClick={() => refetch()} className="mt-3 text-sm font-bold text-primary underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      {summary && !isLoading && (
        <>
          {/* Current Plan */}
          <section className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-[13px] font-bold tracking-wide text-faint uppercase">Current Plan</div>
              <PremiumBadge isPremium={summary.isPremium} />
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-bold",
                  summary.isActive ? "border-success/30 bg-success/10 text-success" : "border-card-border bg-surface text-faint"
                )}
              >
                {summary.isActive ? "Active" : "Not Subscribed"}
              </span>
            </div>
            <div className="mt-1 text-2xl font-extrabold text-primary-deep">{summary.planName}</div>
            <p className="mt-1 text-[13px] text-faint">
              {summary.expiresAt ? (
                <>
                  Expires {formatDate(summary.expiresAt)}
                  {summary.daysRemaining !== null && ` · ${summary.daysRemaining} day${summary.daysRemaining === 1 ? "" : "s"} remaining`}
                </>
              ) : summary.isActive ? (
                "Never expires"
              ) : (
                "Upgrade any time to unlock more benefits."
              )}
            </p>
          </section>

          {/* Benefits Expiring Soon */}
          {expiringContributions.length > 0 && (
            <section className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-5 lg:rounded-[20px]">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-bold text-destructive">Benefits expiring soon</p>
                <p className="mt-1 text-[13px] text-destructive/90">
                  {expiringContributions.map((c) => `${c.planName} (${c.daysRemaining}d left)`).join(", ")} —
                  the unused benefits from{" "}
                  {expiringContributions.length === 1 ? "this plan" : "these plans"} will disappear once{" "}
                  {expiringContributions.length === 1 ? "it expires" : "they expire"}.
                </p>
              </div>
            </section>
          )}

          {/* Total Available Benefits */}
          <div>
            <div className="mb-4 text-lg font-extrabold text-primary-deep">Total Available Benefits</div>
            <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 xl:grid-cols-4">
              {NUMERIC_FEATURE_KEYS.map((key) => (
                <BenefitStatCard
                  key={key}
                  label={NUMERIC_FEATURE_LABELS[key]}
                  icon={NUMERIC_FEATURE_ICONS[key]}
                  used={summary.usage[key]}
                  limit={summary.limits[key]}
                  remaining={summary.remaining[key]}
                />
              ))}
            </div>
          </div>

          {/* Active Membership Benefits */}
          {summary.contributions.length > 0 && (
            <div>
              <div className="mb-4 text-lg font-extrabold text-primary-deep">Active Membership Benefits</div>
              <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-2">
                {summary.contributions.map((c) => (
                  <ContributionCard key={c.subscriptionId} contribution={c} />
                ))}
              </div>
            </div>
          )}

          {/* Feature Details — where each total comes from */}
          {summary.contributions.length > 1 && (
            <div>
              <div className="mb-4 text-lg font-extrabold text-primary-deep">Feature Details</div>
              <Accordion className="flex flex-col gap-2.5">
                {NUMERIC_FEATURE_KEYS.map((key) => {
                  const limit = summary.limits[key];
                  const total = limit === null ? "Unlimited" : `${summary.remaining[key]} Remaining`;
                  return (
                    <AccordionItem
                      key={key}
                      value={key}
                      className="overflow-hidden rounded-2xl border border-card-border bg-card"
                    >
                      <AccordionTrigger className="px-5 py-4 text-[15px] font-bold text-primary-deep hover:no-underline">
                        {NUMERIC_FEATURE_LABELS[key]}: {total}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 px-5 pb-4.5">
                        {summary.contributions.map((c) => (
                          <div key={c.subscriptionId} className="flex items-center justify-between text-sm">
                            <div>
                              <div className="font-semibold text-ink">{c.planName}</div>
                              <div className="text-[12.5px] text-faint">
                                {c.expiresAt ? `Expires ${formatDate(c.expiresAt)}` : "Never expires"}
                              </div>
                            </div>
                            <div className="font-bold text-primary-deep">
                              {c.limits[key] === null ? "Unlimited" : `${c.remaining[key]} remaining`}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          )}

          {/* Premium Features */}
          <div>
            <div className="mb-4 text-lg font-extrabold text-primary-deep">Premium Features</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PREMIUM_FEATURES.map(({ key, label }) => {
                const available = summary.features[key];
                return (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4",
                      available ? "border-success/30 bg-success/5" : "border-card-border bg-surface"
                    )}
                  >
                    {available ? (
                      <Check className="size-4 shrink-0 text-success" />
                    ) : (
                      <Lock className="size-4 shrink-0 text-faint" />
                    )}
                    <span className={cn("text-sm font-semibold", available ? "text-ink" : "text-faint")}>{label}</span>
                  </div>
                );
              })}
            </div>
            {!summary.isPremium && (
              <Link
                href="/plans"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary underline underline-offset-4"
              >
                <Star className="size-3.5" /> Upgrade to unlock premium features
              </Link>
            )}
          </div>
        </>
      )}

      {/* Membership History */}
      <div>
        <div className="mb-4 text-lg font-extrabold text-primary-deep">Membership History</div>

        {isHistoryLoading && <SectionSkeleton />}

        {!isHistoryLoading && (!history || history.length === 0) && (
          <div className="rounded-2xl border border-dashed border-card-border bg-card p-8 text-center lg:rounded-[20px]">
            <p className="text-sm font-semibold text-ink">No membership history yet</p>
            <p className="mt-1 text-sm text-faint">Your subscriptions will show up here once you choose a plan.</p>
            <Link href="/plans" className="mt-3 inline-block text-sm font-bold text-primary underline underline-offset-4">
              Browse plans
            </Link>
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
                  <div className="text-sm font-extrabold text-primary-deep">{row.plan_name_snapshot}</div>
                  <div className="mt-0.5 text-[12.5px] text-faint">
                    {formatDate(row.started_at)} — {formatDate(row.expires_at) ?? "No expiry"}
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
    </div>
  );
}
