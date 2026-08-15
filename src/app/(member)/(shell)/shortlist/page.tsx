"use client";

import Link from "next/link";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { MobileBackHeader } from "@/components/layout/mobile-back-header";
import { formatRelativeTime } from "@/lib/format-time";
import { useShortlist, useToggleShortlist } from "@/features/shortlist/use-shortlist";
import type { ShortlistRecord } from "@/features/shortlist/types";

function ShortlistRow({ entry }: { entry: ShortlistRecord }) {
  const toggle = useToggleShortlist();
  const isRemoving = toggle.isPending && toggle.variables?.memberId === entry.member_id;

  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-card-border bg-card p-3.5">
      <Link href={`/profile/${entry.member_id}`} className="shrink-0">
        <MemberProfilePhoto
          photoUrl={entry.photo_url}
          approvalStatus={entry.photo_url ? "APPROVED" : null}
          gender={entry.gender}
          name={`${entry.first_name} ${entry.last_name}`}
          className="size-14 rounded-xl"
          showMessage={false}
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/profile/${entry.member_id}`}
          className="truncate text-[14.5px] font-bold text-primary-deep hover:underline"
        >
          {entry.first_name} {entry.last_name}
        </Link>
        <div className="mt-0.5 text-xs text-faint">{entry.member_code}</div>
        <div className="mt-1 text-[11.5px] text-faint">Shortlisted {formatRelativeTime(entry.created_at)}</div>
      </div>

      <Button
        size="icon-sm"
        variant="outline"
        aria-label="Remove from shortlist"
        disabled={isRemoving}
        className="border-gold text-gold shrink-0"
        onClick={() => toggle.mutate({ memberId: entry.member_id, isShortlisted: true })}
      >
        {isRemoving ? <Loader2 className="size-3.5 animate-spin" /> : <Star className="size-3.5 fill-gold" />}
      </Button>
    </div>
  );
}

export default function ShortlistPage() {
  const { data: shortlist = [], isLoading } = useShortlist();

  return (
    <div className="mx-auto max-w-215">
      <MobileBackHeader title="My Shortlist" />

      <div className="px-5 py-6 lg:px-6 lg:py-9">
        <div className="mb-6 hidden items-center gap-2 lg:flex">
          <Star className="size-5 text-gold-text" />
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep">My Shortlist</h1>
        </div>

        {isLoading ? (
          <p className="py-16 text-center text-sm text-faint">Loading…</p>
        ) : shortlist.length === 0 ? (
          <p className="py-16 text-center text-sm text-faint">
            You haven&apos;t shortlisted anyone yet. Tap the star on a profile to save it here.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {shortlist.map((entry) => (
              <ShortlistRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
