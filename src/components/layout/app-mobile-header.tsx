import Link from "next/link";
import { Bell } from "lucide-react";
import { MemberProfilePhoto, type PhotoApprovalStatus } from "@/components/shared/member-profile-photo";

export function AppMobileHeader({
  greeting,
  name,
  notificationCount = 4,
  photoUrl = null,
  approvalStatus = null,
  gender = "Male",
}: {
  greeting: string;
  name: string;
  notificationCount?: number;
  photoUrl?: string | null;
  approvalStatus?: PhotoApprovalStatus;
  gender?: "Male" | "Female" | string;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-card-border bg-card px-5 py-4 lg:hidden">
      <div className="flex items-center gap-3">
        <MemberProfilePhoto
          photoUrl={photoUrl}
          approvalStatus={approvalStatus}
          gender={gender}
          name={name}
          className="size-10.5 shrink-0 rounded-lg border-2 border-gold-light"
          showMessage={false}
        />
        <div>
          <div className="text-xs font-semibold text-faint">{greeting}</div>
          <div className="text-base font-extrabold text-primary-deep">{name}</div>
        </div>
      </div>
      <Link
        href="/notifications"
        className="relative flex size-10.5 items-center justify-center rounded-xl border border-input bg-card"
      >
        <Bell className="size-4 text-primary-deep" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex min-w-4.5 items-center justify-center rounded-full bg-peach px-1 text-[10px] font-extrabold text-white">
            {notificationCount}
          </span>
        )}
      </Link>
    </header>
  );
}
