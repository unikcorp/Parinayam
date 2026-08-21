"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ImageSlot } from "@/components/shared/image-slot";
import { Button } from "@/components/ui/button";
import { useBlockedMembers, useUnblockMember } from "@/hooks/use-blocked-members";
import { ApiError } from "@/lib/api";
import { ListRowsSkeleton } from "@/components/shared/loading-skeletons";

export default function BlockedUsersPage() {
  const { data, isLoading, isError } = useBlockedMembers();
  const unblock = useUnblockMember();
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleUnblock(memberId: number) {
    setError(null);
    unblock.mutate(memberId, {
      onSuccess: () => setConfirmingId(null),
      onError: (err) => setError(err instanceof ApiError ? err.message : "Could not unblock this member."),
    });
  }

  return (
    <div className="flex flex-col gap-5.5">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep">Blocked Users</h1>

      {isLoading && <ListRowsSkeleton />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm font-semibold text-destructive">Unable to load your blocked members.</p>
          <p className="text-sm text-faint">Please try again.</p>
        </div>
      )}

      {data && data.length === 0 && (
        <section className="flex flex-col items-center gap-2 rounded-2xl border border-card-border bg-card p-10 text-center lg:rounded-[20px]">
          <span className="text-2xl">🚫</span>
          <p className="text-sm font-semibold text-ink">No blocked members</p>
          <p className="text-sm text-faint">You haven&apos;t blocked anyone yet.</p>
        </section>
      )}

      {data && data.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-card-border bg-card lg:rounded-[20px]">
          {data.map((m, i) => (
            <div
              key={m.id}
              className={`flex items-center gap-3.5 px-5 py-4 ${i !== data.length - 1 ? "border-b border-[#F5F6F9]" : ""}`}
            >
              {m.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photo_url} alt={m.first_name} className="size-12 shrink-0 rounded-full object-cover" />
              ) : (
                <ImageSlot label={m.first_name} className="size-12 shrink-0 rounded-full" />
              )}
              <div className="flex-1">
                <div className="text-sm font-bold text-ink">
                  {m.first_name} {m.last_name}
                </div>
                <div className="mt-0.5 text-xs text-faint">
                  {m.member_code} · Blocked on {new Date(m.created_at).toLocaleDateString()}
                </div>
              </div>

              {confirmingId === m.blocked_member_id ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleUnblock(m.blocked_member_id)}
                    disabled={unblock.isPending}
                  >
                    {unblock.isPending && <Loader2 className="size-3.5 animate-spin" />} Confirm
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setConfirmingId(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setConfirmingId(m.blocked_member_id)}>
                  Unblock
                </Button>
              )}
            </div>
          ))}
        </section>
      )}

      {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}
