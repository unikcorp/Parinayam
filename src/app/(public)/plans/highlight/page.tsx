"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useHighlightPackages } from "@/features/profile-highlight/use-profile-highlight";
import { useMembership } from "@/features/membership/use-membership";
import { useAuth } from "@/context/auth-context";
import { PlanCardsSkeleton } from "@/components/shared/loading-skeletons";

export default function HighlightPackagesPage() {
  const router = useRouter();
  const { data: packages, isLoading, isError } = useHighlightPackages();
  const { isAuthenticated } = useAuth();
  const { isPremium, isLoading: membershipLoading } = useMembership();
  const showUpgradeNotice = isAuthenticated && !membershipLoading && !isPremium;

  return (
    <div className="mx-auto max-w-290 px-5 pt-8 pb-10 lg:px-6 lg:pt-12">
      <div className="mb-8 text-center lg:mb-10">
        <div className="mb-2.5 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
          Profile Highlight
        </div>
        <h1 className="mb-2 text-[25px] font-extrabold tracking-[-0.02em] text-primary-deep lg:mb-3 lg:text-[42px]">
          Make your profile stand out
        </h1>
        <p className="mx-auto max-w-lg text-sm text-muted-foreground lg:text-[15px]">
          Highlight your profile to rank higher in search and get noticed faster — a perk for premium plan members.
        </p>
      </div>

      {showUpgradeNotice && (
        <div className="mx-auto mb-8 max-w-lg rounded-xl border border-gold/30 bg-gold/5 px-5 py-3.5 text-center text-sm font-semibold text-primary-deep">
          Profile Highlight is available to premium plan members.{" "}
          <button type="button" onClick={() => router.push("/plans")} className="text-gold underline underline-offset-2">
            Upgrade your plan
          </button>{" "}
          to unlock it.
        </div>
      )}

      {isLoading && <PlanCardsSkeleton />}

      {isError && !isLoading && (
        <p className="text-center text-sm font-semibold text-destructive">Could not load Highlight packages. Please try again.</p>
      )}

      {!isLoading && !isError && (!packages || packages.length === 0) && (
        <p className="text-center text-sm text-faint">No Highlight packages are available right now.</p>
      )}

      {!isLoading && packages && packages.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex flex-col gap-4 rounded-2xl border border-card-border bg-card p-6 lg:rounded-[20px]"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-gold-gradient">
                <Sparkles className="size-5 text-primary-deep" />
              </span>
              <div>
                <div className="text-lg font-extrabold text-primary-deep">{pkg.package_name}</div>
                <div className="mt-1 text-2xl font-extrabold text-primary-deep">
                  ₹{Number(pkg.price).toLocaleString("en-IN")}
                  <span className="ml-1 text-xs font-medium text-faint">/ {pkg.duration_days} days</span>
                </div>
              </div>
              {pkg.description && <p className="text-sm text-muted-foreground">{pkg.description}</p>}
              <button
                type="button"
                onClick={() =>
                  showUpgradeNotice ? router.push("/plans") : router.push(`/checkout?highlight=${pkg.id}`)
                }
                className="mt-auto rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
              >
                {showUpgradeNotice ? "Upgrade to unlock" : "Purchase"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
