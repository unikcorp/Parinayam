import { Info, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContributionCard } from "./ContributionCard";
import { NUMERIC_FEATURE_KEYS, NUMERIC_FEATURE_LABELS } from "../summary-types";
import type { PurchasePreview } from "../preview-types";

const PREMIUM_FEATURE_LABELS = {
  canUseChat: "In-App Chat",
  canUseAdvancedSearch: "Advanced Search",
  canSeeWhoViewedMe: "Who Viewed My Profile",
  canUseProfileBoost: "Profile Boost",
  hasPriorityVisibility: "Priority Visibility",
} as const;

interface PurchaseConfirmationProps {
  preview: PurchasePreview;
  onConfirm: () => void;
  onCancel: () => void;
}

// Shown before checkout whenever the member already has something active —
// buying a new plan never cancels it (Feature 3/4 carry-forward), so this
// makes that visible instead of leaving it to be discovered afterward.
export function PurchaseConfirmation({ preview, onConfirm, onCancel }: PurchaseConfirmationProps) {
  const { newPlan, existingContributions, projected } = preview;

  const newlyActivatedFeatures = (Object.keys(PREMIUM_FEATURE_LABELS) as (keyof typeof PREMIUM_FEATURE_LABELS)[]).filter(
    (key) => newPlan.features[key] && !existingContributions.some((c) => c.features[key])
  );

  return (
    <div className="flex flex-col gap-5.5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-[28px]">
          Confirm your purchase
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground lg:text-[14.5px]">
          You already have active membership benefits — here&apos;s what happens to them.
        </p>
      </div>

      {/* Your New Membership */}
      <section>
        <div className="mb-3 text-[13px] font-bold tracking-wide text-faint uppercase">Your New Membership</div>
        <div className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-6">
          <div className="flex items-center gap-3.5 rounded-2xl bg-primary-deep p-4 text-white">
            <span className="bg-gold-gradient flex size-11 shrink-0 items-center justify-center rounded-xl">
              <Star className="size-[19px] fill-current" />
            </span>
            <div className="flex-1">
              <div className="text-[15px] font-extrabold">{newPlan.planName} Plan</div>
              <div className="mt-0.5 text-xs text-white/70">
                {newPlan.durationDays ? `${newPlan.durationDays} days` : "Lifetime plan"}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {NUMERIC_FEATURE_KEYS.map((key) => (
              <div key={key}>
                <div className="text-[12px] text-faint">{NUMERIC_FEATURE_LABELS[key]}</div>
                <div className="text-base font-extrabold text-primary-deep">
                  {newPlan.limits[key] === null ? "Unlimited" : newPlan.limits[key]}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[12.5px] font-semibold text-primary">
            This membership will become your current plan.
          </p>
        </div>
      </section>

      {/* Your Existing Active Benefits */}
      {existingContributions.length > 0 && (
        <section>
          <div className="mb-3 text-[13px] font-bold tracking-wide text-faint uppercase">
            Your Existing Active Benefits
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {existingContributions.map((c) => (
              <ContributionCard key={c.subscriptionId} contribution={c} />
            ))}
          </div>
        </section>
      )}

      {/* Alert message */}
      <section className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-surface-blue/50 p-5 lg:rounded-[20px]">
        <Info className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="text-[13px] leading-[1.6] text-primary-deep">
          <p className="font-bold">Your remaining benefits won&apos;t be lost.</p>
          <p className="mt-1.5">
            Your new plan activates immediately after successful payment and becomes your current plan. The
            benefits left on your existing membership stay available too — they continue until{" "}
            <span className="font-semibold">that plan&apos;s own expiry date</span>, they&apos;re never merged
            permanently into the new plan. Each membership keeps its own expiry date, and once an older membership
            expires, its unused remaining benefits expire with it — from then on, only your currently valid
            memberships count toward your available limits.
          </p>
        </div>
      </section>

      {/* After This Purchase */}
      <section>
        <div className="mb-3 text-[13px] font-bold tracking-wide text-faint uppercase">After This Purchase</div>
        <div className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-6">
          <div className="flex flex-col divide-y divide-card-border">
            {NUMERIC_FEATURE_KEYS.map((key) => {
              const isUnlimited = projected.limits[key] === null;
              // "Current remaining" — the sum of what's left across every
              // still-valid existing membership for this one feature.
              const currentRemaining = existingContributions.reduce((sum, c) => {
                if (c.limits[key] === null) return sum;
                return sum + (c.remaining[key] ?? 0);
              }, 0);
              const currentHasUnlimited = existingContributions.some((c) => c.limits[key] === null);

              return (
                <div key={key} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="text-sm font-semibold text-ink">{NUMERIC_FEATURE_LABELS[key]}</span>
                  <div className="flex items-center gap-2 text-[13px]">
                    <span className="text-faint">{currentHasUnlimited ? "Unlimited" : currentRemaining}</span>
                    <span className="text-faint">+</span>
                    <span className="font-semibold text-primary">
                      {newPlan.limits[key] === null ? "Unlimited" : newPlan.limits[key]}
                    </span>
                    <span className="text-faint">=</span>
                    <span className="rounded-full bg-success-bg px-2.5 py-0.5 text-[12.5px] font-extrabold text-success">
                      {isUnlimited ? "Unlimited" : projected.remaining[key]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {newlyActivatedFeatures.length > 0 && (
            <div className="mt-4 border-t border-card-border pt-4">
              <div className="mb-2 text-[12px] font-bold tracking-wide text-faint uppercase">
                Newly unlocked features
              </div>
              <div className="flex flex-wrap gap-2">
                {newlyActivatedFeatures.map((key) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-[12px] font-bold text-success"
                  >
                    <Check className="size-3.5" /> {PREMIUM_FEATURE_LABELS[key]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTAs */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" size="cta" onClick={onCancel} className={cn("sm:w-auto")}>
          Cancel / Go Back
        </Button>
        <Button variant="gold" size="cta" onClick={onConfirm} className="sm:w-auto">
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
