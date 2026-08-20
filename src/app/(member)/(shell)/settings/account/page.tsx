"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Pause, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMyProfile, useUpdateAccountStatus, useDeleteAccount, useUpdateBasicDetails } from "@/hooks/use-my-profile";
import { useRegistrationLookups } from "@/features/registration-wizard/use-registration-lookups";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";

function toDateInputValue(dob: string): string {
  return dob.includes("T") ? dob.slice(0, 10) : dob;
}

export default function AccountSettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { data, isLoading } = useMyProfile();
  const updateStatus = useUpdateAccountStatus();
  const deleteAccount = useDeleteAccount();
  const lookups = useRegistrationLookups();
  const updateBasicDetails = useUpdateBasicDetails(data?.member.id ?? null);

  const [pauseMessage, setPauseMessage] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [editingBasics, setEditingBasics] = useState(false);
  const [basicsError, setBasicsError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [religion, setReligion] = useState("");

  useEffect(() => {
    if (!data) return;
    setFirstName(data.member.first_name);
    setLastName(data.member.last_name);
    setDob(toDateInputValue(data.member.dob));
    setGender(data.member.gender);
    setReligion(data.member.religion_name ?? "");
  }, [data]);

  if (isLoading || !data) {
    return <div className="py-16 text-center text-sm text-faint">Loading…</div>;
  }

  const isPaused = data.member.account_status === "INACTIVE";

  function handleSaveBasics() {
    setBasicsError(null);
    if (!firstName.trim() || !lastName.trim() || !dob) {
      setBasicsError("Name and date of birth are required.");
      return;
    }
    const [year, month, day] = dob.split("-").map(Number);

    updateBasicDetails.mutate(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
        dobDay: day,
        dobMonth: month,
        dobYear: year,
        religion: religion ? lookups.resolveReligionId(religion) : null,
        profileCreatedBy: data!.member.profile_created_by,
        accountStatus: data!.member.account_status,
        mobileCountryCode: data!.member.mobile_country_code,
        mobileNumber: data!.member.mobile,
        maritalStatus: data!.member.marital_status,
      },
      {
        onSuccess: () => {
          setEditingBasics(false);
          toast.success("Your details have been updated.");
        },
        onError: (error) => setBasicsError(error instanceof ApiError ? error.message : "Could not save your details."),
      },
    );
  }

  function handleCancelBasics() {
    setFirstName(data!.member.first_name);
    setLastName(data!.member.last_name);
    setDob(toDateInputValue(data!.member.dob));
    setGender(data!.member.gender);
    setReligion(data!.member.religion_name ?? "");
    setBasicsError(null);
    setEditingBasics(false);
  }

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
        toast.success("Your account has been scheduled for deletion. You have 30 days to cancel.");
        router.push("/login");
      },
      onError: (error) => setDeleteError(error instanceof ApiError ? error.message : "Could not delete your account."),
    });
  }

  return (
    <div className="flex flex-col gap-5.5">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep">Account</h1>

      <section className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-7">
        <div className="mb-4.5 flex items-center justify-between">
          <div className="text-lg font-extrabold text-primary-deep">Basic Details</div>
          {!editingBasics && (
            <Button variant="outline" size="sm" onClick={() => setEditingBasics(true)}>
              <Pencil className="size-3.5" /> Edit
            </Button>
          )}
        </div>

        {editingBasics ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-primary-deep">First name</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-auto rounded-xl px-3.5 py-2.5" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-primary-deep">Last name</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-auto rounded-xl px-3.5 py-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-primary-deep">Date of birth</label>
                <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="h-auto rounded-xl px-3.5 py-2.5" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-primary-deep">Gender</label>
                <Select value={gender} onValueChange={(v) => v && setGender(v as "Male" | "Female")}>
                  <SelectTrigger className="w-full">
                    <SelectValue>{(v: string) => v}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-primary-deep">Religion</label>
              <Select value={religion} onValueChange={(v) => v && setReligion(v)}>
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue>{(v: string) => v || "Select religion"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {lookups.religionOptions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {basicsError && <p className="text-xs font-semibold text-destructive">{basicsError}</p>}

            <div className="flex gap-2.5">
              <Button onClick={handleSaveBasics} disabled={updateBasicDetails.isPending}>
                {updateBasicDetails.isPending && <Loader2 className="size-4 animate-spin" />} Save
              </Button>
              <Button variant="outline" onClick={handleCancelBasics} disabled={updateBasicDetails.isPending}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold text-faint">Name</div>
              <div className="font-semibold text-ink">
                {data.member.first_name} {data.member.last_name}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-faint">Date of birth</div>
              <div className="font-semibold text-ink">{toDateInputValue(data.member.dob)}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-faint">Gender</div>
              <div className="font-semibold text-ink">{data.member.gender}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-faint">Religion</div>
              <div className="font-semibold text-ink">{data.member.religion_name ?? "Not set"}</div>
            </div>
          </div>
        )}
      </section>

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
          Your account will be permanently deleted after 30 days. You can cancel this by logging back in within 30 days.
        </p>

        <Button
          variant="destructive"
          onClick={() => {
            setConfirmText("");
            setDeletePassword("");
            setDeleteError(null);
            setDeleteDialogOpen(true);
          }}
        >
          <Trash2 className="size-4" /> Delete account
        </Button>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDescription>
                Your account will be permanently deleted after 30 days. You can cancel this by logging back in
                within 30 days.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3.5">
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
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                No, Keep My Account
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteAccount.isPending}>
                {deleteAccount.isPending && <Loader2 className="size-4 animate-spin" />} Yes, Delete My Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
