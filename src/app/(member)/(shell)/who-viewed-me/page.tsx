"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { MobileBackHeader } from "@/components/layout/mobile-back-header";
import { formatRelativeTime } from "@/lib/format-time";
import { useProfileVisitors } from "@/features/profile-views/use-profile-views";
import { useMembership } from "@/features/membership/use-membership";
import { UpgradePrompt } from "@/features/membership/components/UpgradePrompt";
import type { ProfileVisitorRecord } from "@/features/profile-views/types";
import { ListRowsSkeleton } from "@/components/shared/loading-skeletons";

function VisitorRow({ entry }: { entry: ProfileVisitorRecord }) {
  return (
    <Link
      href={`/profile/${entry.member_id}`}
      className="flex items-center gap-3.5 rounded-2xl border border-card-border bg-card p-3.5 transition-shadow hover:shadow-card-hover"
    >
      <MemberProfilePhoto
        photoUrl={entry.photo_url}
        approvalStatus={entry.photo_url ? "APPROVED" : null}
        isBlurred={entry.photo_is_blurred}
        gender={entry.gender}
        name={`${entry.first_name} ${entry.last_name}`}
        className="size-14 shrink-0 rounded-xl"
        showMessage={false}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14.5px] font-bold text-primary-deep">
          {entry.first_name} {entry.last_name}
        </div>
        <div className="mt-0.5 truncate text-xs text-faint">
          {entry.member_code}
          {(entry.district_name || entry.state_name) &&
            ` · ${[entry.district_name, entry.state_name].filter(Boolean).join(", ")}`}
        </div>
        <div className="mt-1 text-[11.5px] text-faint">Viewed {formatRelativeTime(entry.viewed_at)}</div>
      </div>
    </Link>
  );
}

export default function WhoViewedMePage() {
  const { isLoading: membershipLoading, canSeeWhoViewedMe } = useMembership();
  const { data: visitors = [], isLoading } = useProfileVisitors();

  return (
    <div className="mx-auto max-w-215">
      <MobileBackHeader title="Who Viewed Me" />

      <div className="px-5 py-6 lg:px-6 lg:py-9">
        <div className="mb-6 hidden items-center gap-2 lg:flex">
          <Eye className="size-5 text-gold-text" />
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep">Who Viewed Me</h1>
        </div>

        {membershipLoading ? (
          <ListRowsSkeleton />
        ) : !canSeeWhoViewedMe ? (
          <div className="mx-auto max-w-sm py-10">
            <UpgradePrompt
              feature="Who Viewed Me"
              message="Available with Premium — upgrade to see who viewed your profile."
            />
          </div>
        ) : isLoading ? (
          <ListRowsSkeleton />
        ) : visitors.length === 0 ? (
          <p className="py-16 text-center text-sm text-faint">
            No one has viewed your profile yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {visitors.map((entry) => (
              <VisitorRow key={entry.member_id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
