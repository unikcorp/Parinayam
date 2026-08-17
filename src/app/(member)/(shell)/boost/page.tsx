"use client";

import { Rocket } from "lucide-react";
import { MobileBackHeader } from "@/components/layout/mobile-back-header";
import { useMembership } from "@/features/membership/use-membership";
import { UpgradePrompt } from "@/features/membership/components/UpgradePrompt";

// No boost feature exists on the backend yet — this is intentionally just
// a locked placeholder (per spec: "if the feature UI doesn't exist yet, add
// a placeholder, don't build the full feature"). Gold/Platinum members see
// a "coming soon" state instead of a fake working feature.
export default function ProfileBoostPage() {
  const { isLoading, canUseProfileBoost } = useMembership();

  return (
    <div className="mx-auto max-w-215">
      <MobileBackHeader title="Profile Boost" />

      <div className="px-5 py-6 lg:px-6 lg:py-9">
        <div className="mb-6 hidden items-center gap-2 lg:flex">
          <Rocket className="size-5 text-gold-text" />
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep">Profile Boost</h1>
        </div>

        <div className="mx-auto max-w-sm py-10">
          {isLoading ? (
            <p className="text-center text-sm text-faint">Loading…</p>
          ) : !canUseProfileBoost ? (
            <UpgradePrompt
              feature="Profile Boost"
              message="Move to the top of search results for 24 hours. Available on Gold and Platinum plans."
            />
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gold-light bg-surface-cream-2 p-6 text-center">
              <span className="bg-gold-gradient flex size-11 items-center justify-center rounded-full text-white">
                <Rocket className="size-5" />
              </span>
              <div>
                <div className="text-[15px] font-extrabold text-primary-deep">Coming soon</div>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Profile Boost is included in your plan and will be available here soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
