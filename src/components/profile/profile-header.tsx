import { Camera, Share2, MoreHorizontal, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ImageSlot } from "@/components/shared/image-slot";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { Button } from "@/components/ui/button";
import { ContactButton } from "@/components/profile/contact-button";
import { InterestButton } from "@/features/interests/components/InterestButton";
import { MessageButton } from "@/features/messaging/components/MessageButton";
import { ShortlistButton } from "@/features/shortlist/components/ShortlistButton";
import { formatRelativeTime } from "@/lib/format-time";
import { calculateAge, type PublicMemberProfileResponse } from "@/types/member-profile";

async function shareProfile(name: string) {
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: name, url });
    } catch {
      // User cancelled the share sheet — not an error.
    }
    return;
  }
  await navigator.clipboard.writeText(url);
  toast.success("Profile link copied to clipboard.");
}

export function ProfileHeader({ profile }: { profile: PublicMemberProfileResponse }) {
  const { member, photos, verified, lastLoginAt } = profile;
  const name = `${member.first_name} ${member.last_name}`;
  const age = calculateAge(member.dob);
  const place = [member.district_name, member.state_name, member.country_name].filter(Boolean).join(", ");
  const details = [member.occupation_name, place, member.height, member.marital_status, member.member_code]
    .filter(Boolean)
    .join(" · ");
  const managedByLabel = member.profile_created_by && member.profile_created_by !== "Self" ? member.profile_created_by : null;
  const lastActiveLabel = lastLoginAt ? `Last active ${formatRelativeTime(lastLoginAt)}` : null;
  const profilePhoto = photos.find((p) => p.is_profile_photo) ?? null;

  return (
    <>
      {/* DESKTOP COVER */}
      <div className="hidden px-12 pt-6 lg:block">
        <div className="relative">
          <ImageSlot label="Cover photo — landscape" className="h-70 w-full rounded-3xl" />
          <div className="absolute bottom-16 left-11 flex items-end gap-6">
            <div className="relative">
              <MemberProfilePhoto
                photoUrl={profilePhoto?.photo_url ?? null}
                approvalStatus={profilePhoto?.approval_status ?? null}
                gender={member.gender}
                name={name}
                className="size-38 rounded-full border-[6px] border-white shadow-[0_16px_40px_rgba(127,29,29,0.18)]"
                showMessage={false}
              />
            </div>
          </div>
          <div className="absolute right-6 bottom-5 flex gap-2.5">
            <span className="rounded-full bg-white/94 px-4 py-2 text-[13px] font-bold text-primary-deep">
              <Camera className="mr-1.5 inline size-3.5" /> {photos.length} photos
            </span>
          </div>
        </div>

        <div className="flex min-h-24 items-start justify-between pt-5 pl-56">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[30px] font-extrabold tracking-[-0.02em] whitespace-nowrap text-primary-deep">
                {name}, {age}
              </span>
              {verified && <Badge tone="primary">✓ Verified</Badge>}
            </div>
            <div className="mt-2 text-[15px] text-muted-foreground">{details}</div>
            {(managedByLabel || lastActiveLabel) && (
              <div className="mt-1 text-[13.5px] text-faint">
                {managedByLabel && `Profile managed by ${managedByLabel} · `}
                {lastActiveLabel}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5 pt-1.5">
            <InterestButton memberId={member.id} size="cta" />
            <ContactButton memberId={member.id} size="cta" />
            <MessageButton memberId={member.id} size="icon-cta" />
            <ShortlistButton memberId={member.id} size="icon-cta" />
            <Button variant="outline" size="icon-cta" aria-label="Share" onClick={() => shareProfile(name)}>
              <Share2 className="size-4.5" />
            </Button>
            <Button variant="outline" size="icon-cta" aria-label="More">
              <MoreHorizontal className="size-4.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE HERO */}
      <div className="lg:hidden">
        <div className="relative">
          <MemberProfilePhoto
            photoUrl={profilePhoto?.photo_url ?? null}
            approvalStatus={profilePhoto?.approval_status ?? null}
            gender={member.gender}
            name={name}
            className="h-105 w-full"
            showMessage={false}
          />
          <div className="absolute inset-x-0 top-0 flex justify-between p-4">
            <button className="flex size-10.5 items-center justify-center rounded-xl bg-white/92 text-primary-deep">
              <ArrowLeft className="size-4" />
            </button>
            <div className="flex gap-2">
              <button
                className="flex size-10.5 items-center justify-center rounded-xl bg-white/92 text-primary-deep"
                onClick={() => shareProfile(name)}
              >
                <Share2 className="size-4" />
              </button>
              <button className="flex size-10.5 items-center justify-center rounded-xl bg-white/92 text-primary-deep">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </div>
          <div className="absolute bottom-4 left-5 flex gap-2">
            <span className="rounded-full bg-white/94 px-3.5 py-1.5 text-xs font-bold text-primary-deep">
              <Camera className="mr-1 inline size-3" /> {photos.length}
            </span>
          </div>
        </div>

        <div className="relative z-[3] -mt-6 rounded-t-3xl bg-card px-5 pt-5.5 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[23px] font-extrabold tracking-[-0.02em] whitespace-nowrap text-primary-deep">
              {name}, {age}
            </span>
            {verified && <Badge tone="primary" small>✓ Verified</Badge>}
          </div>
          <div className="mt-1.5 text-[13.5px] text-muted-foreground">
            {[member.occupation_name, place.split(",")[0], member.height, member.marital_status]
              .filter(Boolean)
              .join(" · ")}
          </div>
          {(managedByLabel || lastActiveLabel) && (
            <div className="mt-1.5 text-xs font-semibold text-faint">
              {managedByLabel && `Managed by ${managedByLabel} · `}
              {lastActiveLabel}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Badge({
  tone,
  small,
  children,
}: {
  tone: "primary" | "gold" | "success";
  small?: boolean;
  children: React.ReactNode;
}) {
  const tones = {
    primary: "bg-primary text-white",
    gold: "bg-gold-gradient text-white",
    success: "bg-success-bg text-success",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-extrabold whitespace-nowrap ${tones[tone]} ${
        small ? "px-2.5 py-1 text-[10.5px]" : "px-3.5 py-1.5 text-xs"
      }`}
    >
      {children}
    </span>
  );
}
