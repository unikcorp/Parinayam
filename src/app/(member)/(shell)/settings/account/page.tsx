"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pause, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMyProfile, useUpdateAccountStatus, useDeleteAccount } from "@/hooks/use-my-profile";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { data, isLoading } = useMyProfile();
  const updateStatus = useUpdateAccountStatus();
  const deleteAccount = useDeleteAccount();

  const [pauseMessage, setPauseMessage] = useState<string | null>(null);

  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm">("idle");
  const [confirmText, setConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (isLoading || !data) {
    return <div className="py-16 text-center text-sm text-faint">Loading…</div>;
  }

  const isPaused = data.member.account_status === "INACTIVE";

  function handleTogglePause() {
    setPauseMessage(null);
    updateStatus.mutate(isPaused ? "ACTIVE" : "INACTIVE", {
      onSuccess: () => setPauseMessage(isPaused ? "Your profile is visible again." : "Your profile is paused and hidden from search."),
      onError: (error) => setPauseMessage(error instanceof ApiError ? error.message : "Something went wrong."),
    });
  }

  function handleDelete() {
    setDeleteError(null);
    if (confirmText.trim().toUpperCase() !== "DELETE") {
      setDeleteError('Type "DELETE" to confirm.');
      return;
    }
    if (!deletePassword) {
      setDeleteError("Enter your password to confirm.");
      return;
    }

    deleteAccount.mutate(deletePassword, {
      onSuccess: () => {
        logout();
        router.push("/");
      },
      onError: (error) => setDeleteError(error instanceof ApiError ? error.message : "Could not delete your account."),
    });
  }

  return (
    <div className="flex flex-col gap-5.5">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep">Account</h1>

      <section className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-7">
        <div className="mb-1.5 text-lg font-extrabold text-primary-deep">
          {isPaused ? "Resume Profile" : "Pause Profile"}
        </div>
        <p className="mb-4.5 text-[13.5px] text-faint">
          {isPaused
            ? "Your profile is currently paused and hidden from search."
            : "Pausing your profile will hide it from search. You can resume anytime."}
        </p>
        <Button variant="outline" onClick={handleTogglePause} disabled={updateStatus.isPending}>
          {updateStatus.isPending ? <Loader2 className="size-4 animate-spin" /> : <Pause className="size-4" />}
          {isPaused ? "Resume profile" : "Pause profile"}
        </Button>
        {pauseMessage && <p className="mt-2 text-xs font-semibold text-faint">{pauseMessage}</p>}
      </section>

      <section className="rounded-2xl border border-[#F5D9D6] bg-card p-5 lg:rounded-[20px] lg:p-7">
        <div className="mb-1.5 text-lg font-extrabold text-danger">Delete Account</div>
        <p className="mb-4.5 text-[13.5px] text-faint">
          This permanently deletes your profile and all associated data. This action cannot be easily undone.
        </p>

        {deleteStep === "idle" ? (
          <Button variant="destructive" onClick={() => setDeleteStep("confirm")}>
            <Trash2 className="size-4" /> Delete account
          </Button>
        ) : (
          <div className="flex max-w-md flex-col gap-3.5">
            <p className="text-sm font-bold text-danger">
              Are you sure you want to delete your account? This action cannot be easily undone.
            </p>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary-deep">
                Type DELETE to confirm
              </label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="h-auto rounded-xl px-3.5 py-2.5"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary-deep">Confirm your password</label>
              <Input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="h-auto rounded-xl px-3.5 py-2.5"
              />
            </div>
            {deleteError && <p className="text-xs font-semibold text-destructive">{deleteError}</p>}
            <div className="flex gap-2.5">
              <Button variant="outline" onClick={() => setDeleteStep("idle")}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteAccount.isPending}>
                {deleteAccount.isPending && <Loader2 className="size-4 animate-spin" />} Permanently delete
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
