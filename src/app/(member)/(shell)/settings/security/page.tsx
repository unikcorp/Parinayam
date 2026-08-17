"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMyProfile, useChangePassword, useLogoutOtherDevices } from "@/hooks/use-my-profile";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";
import { passwordField } from "@/validation/rules";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { data } = useMyProfile();
  const { logout } = useAuth();
  const changePassword = useChangePassword();
  const logoutOthers = useLogoutOtherDevices();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setFormError("Enter your current password.");
      return;
    }
    const validation = passwordField().safeParse(newPassword);
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message ?? "Enter a valid new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("New passwords do not match.");
      return;
    }

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setSuccessMessage("Password updated successfully.");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error) => {
          setFormError(error instanceof ApiError ? error.message : "Could not update your password.");
        },
      }
    );
  }

  function handleLogoutOthers() {
    setLogoutMessage(null);
    logoutOthers.mutate(undefined, {
      onSuccess: () => setLogoutMessage("Logged out of all other devices."),
      onError: (error) => setLogoutMessage(error instanceof ApiError ? error.message : "Something went wrong."),
    });
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex flex-col gap-5.5">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep">Password & Security</h1>

      <section className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-7">
        <div className="mb-4.5 text-lg font-extrabold text-primary-deep">Change Password</div>
        <form onSubmit={handleChangePassword} className="flex max-w-md flex-col gap-3.5">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-primary-deep">Current password</label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-auto rounded-xl px-3.5 py-2.5 pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowCurrent((v) => !v)}
                aria-label={showCurrent ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-faint hover:text-primary"
              >
                {showCurrent ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-primary-deep">New password</label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-auto rounded-xl px-3.5 py-2.5 pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowNew((v) => !v)}
                aria-label={showNew ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-faint hover:text-primary"
              >
                {showNew ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-primary-deep">Confirm new password</label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-auto rounded-xl px-3.5 py-2.5 pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-faint hover:text-primary"
              >
                {showConfirm ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
              </button>
            </div>
          </div>
          {formError && <p className="text-xs font-semibold text-destructive">{formError}</p>}
          {successMessage && <p className="text-xs font-semibold text-success">{successMessage}</p>}
          <Button type="submit" size="sm" className="w-fit" disabled={changePassword.isPending}>
            {changePassword.isPending && <Loader2 className="size-3.5 animate-spin" />} Update password
          </Button>
        </form>
      </section>

      <section className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-7">
        <div className="mb-1.5 text-lg font-extrabold text-primary-deep">Login & Security</div>
        <div className="mb-4.5 text-[13px] text-faint">
          Last login: {data?.lastLoginAt ? new Date(data.lastLoginAt).toLocaleString() : "—"}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleLogoutOthers} disabled={logoutOthers.isPending}>
            {logoutOthers.isPending && <Loader2 className="size-3.5 animate-spin" />} Log out of all other devices
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log out of this device
          </Button>
        </div>
        {logoutMessage && <p className="mt-2 text-xs font-semibold text-faint">{logoutMessage}</p>}
      </section>
    </div>
  );
}
