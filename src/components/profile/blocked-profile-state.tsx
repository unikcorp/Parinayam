"use client";

import { Ban } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useUnblockMember } from "@/hooks/use-blocked-members";

// Deliberately shows nothing about the member — no name, no photo, no
// details — since that's the whole point of having blocked them.
export function BlockedProfileState({ memberId }: { memberId: number }) {
  const queryClient = useQueryClient();
  const unblock = useUnblockMember();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-5 py-24 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted text-faint">
        <Ban className="size-9" />
      </div>
      <div>
        <p className="text-base font-extrabold text-primary-deep">You&apos;ve blocked this member</p>
        <p className="mt-1.5 text-sm text-faint">
          Their profile, photos, and details are hidden from you — and yours from them — until you unblock.
        </p>
      </div>
      <Button
        variant="outline"
        disabled={unblock.isPending}
        onClick={() =>
          unblock.mutate(memberId, {
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", String(memberId)] }),
          })
        }
      >
        {unblock.isPending ? "Unblocking…" : "Unblock"}
      </Button>
    </div>
  );
}
