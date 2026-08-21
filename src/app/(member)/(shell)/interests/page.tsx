"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Heart, Loader2, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { formatRelativeTime } from "@/lib/format-time";
import { useReceivedInterests, useRespondToInterest, useSentInterests } from "@/features/interests/use-interests";
import type { InterestRecord, InterestStatus } from "@/features/interests/types";
import { ListRowsSkeleton } from "@/components/shared/loading-skeletons";

const STATUS_LABEL: Record<InterestStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-surface-cream-2 text-gold-text" },
  ACCEPTED: { label: "Accepted", className: "bg-success-bg text-success" },
  REJECTED: { label: "Declined", className: "bg-danger-bg text-danger" },
};

function InterestRow({
  interest,
  showActions,
}: {
  interest: InterestRecord;
  showActions?: boolean;
}) {
  const respond = useRespondToInterest();
  const status = STATUS_LABEL[interest.status];
  const isResponding = respond.isPending && respond.variables?.id === interest.id;

  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-card-border bg-card p-3.5">
      <Link href={`/profile/${interest.member_id}`} className="shrink-0">
        <MemberProfilePhoto
          photoUrl={interest.photo_url}
          approvalStatus={interest.photo_url ? "APPROVED" : null}
          gender={interest.gender}
          name={`${interest.first_name} ${interest.last_name}`}
          className="size-14 rounded-xl"
          showMessage={false}
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/profile/${interest.member_id}`}
          className="truncate text-[14.5px] font-bold text-primary-deep hover:underline"
        >
          {interest.first_name} {interest.last_name}
        </Link>
        <div className="mt-0.5 text-xs text-faint">{interest.member_code}</div>
        <div className="mt-1 text-[11.5px] text-faint">{formatRelativeTime(interest.created_at)}</div>
      </div>

      {showActions && interest.status === "PENDING" ? (
        <div className="flex shrink-0 gap-2">
          <Button
            size="icon-sm"
            aria-label="Accept"
            disabled={isResponding}
            onClick={() => respond.mutate({ id: interest.id, action: "accept" })}
          >
            {isResponding && respond.variables?.action === "accept" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5" />
            )}
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            aria-label="Decline"
            disabled={isResponding}
            onClick={() => respond.mutate({ id: interest.id, action: "reject" })}
          >
            {isResponding && respond.variables?.action === "reject" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <X className="size-3.5" />
            )}
          </Button>
        </div>
      ) : (
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>
          {status.label}
        </span>
      )}
    </div>
  );
}

export default function InterestsPage() {
  const [tab, setTab] = useState("received");
  const { data: received = [], isLoading: receivedLoading } = useReceivedInterests();
  const { data: sent = [], isLoading: sentLoading } = useSentInterests();

  return (
    <div className="mx-auto max-w-215 px-5 py-6 lg:px-6 lg:py-9">
      <div className="mb-6 flex items-center gap-2">
        <Heart className="size-5 text-primary" />
        <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep">Interests</h1>
      </div>

      <Tabs value={tab} onValueChange={(v) => v && setTab(v as string)}>
        <TabsList>
          <TabsTrigger value="received">Received ({received.length})</TabsTrigger>
          <TabsTrigger value="sent">Sent ({sent.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-4">
          {receivedLoading ? (
            <ListRowsSkeleton />
          ) : received.length === 0 ? (
            <p className="py-16 text-center text-sm text-faint">No interests received yet.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {received.map((i) => (
                <InterestRow key={i.id} interest={i} showActions />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-4">
          {sentLoading ? (
            <ListRowsSkeleton />
          ) : sent.length === 0 ? (
            <p className="py-16 text-center text-sm text-faint">You haven&apos;t sent any interests yet.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {sent.map((i) => (
                <InterestRow key={i.id} interest={i} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
