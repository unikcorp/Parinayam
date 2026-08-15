"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Ban, Flag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBlockMember } from "@/hooks/use-blocked-members";
import { useReportMember } from "@/features/member-reports/use-member-reports";
import { REPORT_REASONS, type ReportReason } from "@/features/member-reports/types";

export function ProfileMoreMenu({
  memberId,
  name,
  renderTrigger,
}: {
  memberId: number;
  name: string;
  /** Trigger visuals differ between the desktop card and the mobile photo overlay — caller supplies its own button. */
  renderTrigger: (props: { onClick: () => void }) => React.ReactNode;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const firstName = name.split(" ")[0];
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [details, setDetails] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const block = useBlockMember();
  const report = useReportMember();

  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  function handleBlock() {
    setMenuOpen(false);
    if (!window.confirm(`Block ${name}? They won't be able to view your profile or contact you, and you won't see theirs either.`)) {
      return;
    }
    block.mutate(memberId, {
      onSuccess: () => {
        toast.success(`${name} has been blocked.`);
        queryClient.invalidateQueries({ queryKey: ["profile", String(memberId)] });
        router.back();
      },
      onError: () => toast.error("Could not block this member. Please try again."),
    });
  }

  function handleReportSubmit() {
    if (!reason) return;
    report.mutate(
      { memberId, reason, details },
      {
        onSuccess: () => {
          setReportOpen(false);
          setReason("");
          setDetails("");
          // Reporting also blocks — reflect that immediately instead of
          // leaving the (now-blocked) member's full profile on screen.
          queryClient.invalidateQueries({ queryKey: ["profile", String(memberId)] });
          queryClient.invalidateQueries({ queryKey: ["blocked-members"] });
        },
      }
    );
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        {renderTrigger({ onClick: () => setMenuOpen((v) => !v) })}

        {menuOpen && (
          <div className="absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-xl border border-card-border bg-card py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setReportOpen(true);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-primary-deep hover:bg-surface"
            >
              <Flag className="size-4 text-faint" /> Report {firstName}
            </button>
            <button
              type="button"
              onClick={handleBlock}
              disabled={block.isPending}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-destructive hover:bg-surface disabled:opacity-60"
            >
              <Ban className="size-4" /> Block {firstName}
            </button>
          </div>
        )}
      </div>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report {name}</DialogTitle>
            <DialogDescription>Tell us what&apos;s wrong with this profile — our team will review it.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3.5">
            <div>
              <Label className="mb-1.5 block text-xs font-bold text-primary-deep">Reason</Label>
              <Select value={reason} onValueChange={(v) => v && setReason(v as ReportReason)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a reason">
                    {REPORT_REASONS.find((r) => r.value === reason)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-bold text-primary-deep">
                Details <span className="font-normal text-faint">(optional)</span>
              </Label>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Anything else we should know?"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReportSubmit} disabled={!reason || report.isPending}>
              {report.isPending ? "Submitting…" : "Submit report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
