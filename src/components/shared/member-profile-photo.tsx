import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export type PhotoApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | null;

export interface MemberProfilePhotoProps {
  photoUrl: string | null;
  approvalStatus: PhotoApprovalStatus;
  gender: "Male" | "Female" | string;
  name?: string;
  /** Sizing/shape classes, e.g. "size-10 rounded-full" — applied to the image itself. */
  className?: string;
  /** Hide the "Wait for the admin approval" caption — for small avatars (header, cards) where it can't fit. */
  showMessage?: boolean;
  /** Approved but blurred by the owner's own photo-visibility setting. */
  isBlurred?: boolean;
}

// The one place that decides which of the three real states a member's own
// photo is in — reused everywhere their photo is shown (dashboard header,
// profile page, settings, profile card) so the logic never drifts out of
// sync between them. No dummy/stock images anywhere in this component.
export function MemberProfilePhoto({
  photoUrl,
  approvalStatus,
  gender,
  name,
  className,
  showMessage = true,
  isBlurred = false,
}: MemberProfilePhotoProps) {
  const defaultAvatar = gender === "Female" ? "/images/women.png" : "/images/men.png";
  const alt = name ? `${name}'s photo` : "Profile photo";

  if (!photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={defaultAvatar} alt={alt} className={cn("object-cover", className)} />;
  }

  if (approvalStatus === "APPROVED" && isBlurred) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={alt} className="size-full object-cover blur-md scale-110" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/35 p-1 text-center">
          <Lock className="size-4 text-white" />
          {showMessage && <span className="text-[10px] leading-tight font-extrabold text-white">Restricted</span>}
        </div>
      </div>
    );
  }

  if (approvalStatus !== "APPROVED") {
    const message =
      approvalStatus === "REJECTED"
        ? "Rejected by admin — please upload a different photo"
        : "Admin approval pending";
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={alt} className="size-full object-cover blur-md scale-110" />
        {showMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 p-1 text-center">
            <span className="text-[10px] leading-tight font-extrabold text-red-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {message}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Approved — the real photo, no blur, no overlay.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={photoUrl} alt={alt} className={cn("object-cover", className)} />;
}
