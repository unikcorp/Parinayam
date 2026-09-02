import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NUMERIC_FEATURE_KEYS, NUMERIC_FEATURE_LABELS, type MembershipContribution } from "../summary-types";

function formatDate(value: string) {
  return new Date(value.replace(" ", "T") + "Z").toLocaleDateString("en-IN");
}

// One entry in "Active Membership Benefits" — a single currently-valid
// subscription's own remaining balances. Several of these can be shown at
// once (a carried-forward upgrade, or a stacked same/lower-plan purchase),
// each contributing to the combined totals shown above them.
export function ContributionCard({ contribution }: { contribution: MembershipContribution }) {
  const { planName, isPrimary, expiresAt, daysRemaining, isExpiringSoon, limits, remaining } = contribution;

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 lg:rounded-[20px]",
        isPrimary ? "border-primary bg-surface-blue/40" : "border-card-border bg-card"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-extrabold text-primary-deep">{planName}</span>
        <Badge variant={isPrimary ? "default" : "secondary"}>{isPrimary ? "Current Plan" : "Also Active"}</Badge>
      </div>

      <p className="mt-1 text-[13px] text-faint">
        {expiresAt ? `Expires ${formatDate(expiresAt)}` : "Never expires"}
        {daysRemaining !== null && ` · ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`}
      </p>

      {isExpiringSoon && (
        <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-destructive/10 px-2.5 py-2 text-[12.5px] font-semibold text-destructive">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          Expiring soon — the remaining benefits below will be lost when this plan expires.
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3.5 border-t border-card-border pt-4 text-[13px]">
        {NUMERIC_FEATURE_KEYS.map((key) => (
          <div key={key}>
            <div className="text-faint">{NUMERIC_FEATURE_LABELS[key]}</div>
            <div className="font-bold text-primary-deep">{limits[key] === null ? "Unlimited" : remaining[key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
