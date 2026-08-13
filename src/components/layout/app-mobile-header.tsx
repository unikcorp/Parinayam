import { MemberProfilePhoto, type PhotoApprovalStatus } from "@/components/shared/member-profile-photo";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";

export function AppMobileHeader({
  greeting,
  name,
  photoUrl = null,
  approvalStatus = null,
  gender = "Male",
}: {
  greeting: string;
  name: string;
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
      <NotificationBell />
    </header>
  );
}
