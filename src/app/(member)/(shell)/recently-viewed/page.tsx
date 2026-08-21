"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { MobileBackHeader } from "@/components/layout/mobile-back-header";
import { formatRelativeTime } from "@/lib/format-time";
import { useRecentlyViewed } from "@/features/profile-views/use-profile-views";
import type { RecentlyViewedRecord } from "@/features/profile-views/types";
import { ListRowsSkeleton } from "@/components/shared/loading-skeletons";

function RecentlyViewedRow({ entry }: { entry: RecentlyViewedRecord }) {
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

export default function RecentlyViewedPage() {
  const { data: recentlyViewed = [], isLoading } = useRecentlyViewed();

  return (
    <div className="mx-auto max-w-215">
      <MobileBackHeader title="Recently Viewed" />

      <div className="px-5 py-6 lg:px-6 lg:py-9">
        <div className="mb-6 hidden items-center gap-2 lg:flex">
          <Eye className="size-5 text-gold-text" />
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep">Recently Viewed</h1>
        </div>

        {isLoading ? (
          <ListRowsSkeleton />
        ) : recentlyViewed.length === 0 ? (
          <p className="py-16 text-center text-sm text-faint">
            You haven&apos;t viewed any profiles yet. Profiles you open will show up here.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recentlyViewed.map((entry) => (
              <RecentlyViewedRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
