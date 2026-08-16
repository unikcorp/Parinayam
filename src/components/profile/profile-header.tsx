"use client";

import { useState } from "react";
import { Camera, Share2, MoreHorizontal, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ContactButton } from "@/components/profile/contact-button";
import { ProfileMoreMenu } from "@/components/profile/profile-more-menu";
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
  const profilePhotoIndex = profilePhoto ? photos.findIndex((p) => p.id === profilePhoto.id) : -1;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      {/* DESKTOP HEADER — plain card, no fake cover banner */}
      <div className="hidden px-12 pt-6 lg:block">
        <div className="flex items-start gap-7 rounded-[22px] border border-card-border bg-card p-8">
          <button
            type="button"
            className="shrink-0 cursor-zoom-in disabled:cursor-default"
            onClick={() => setLightboxIndex(profilePhotoIndex)}
            disabled={!profilePhoto}
          >
            <MemberProfilePhoto
              photoUrl={profilePhoto?.photo_url ?? null}
              approvalStatus={profilePhoto?.approval_status ?? null}
              gender={member.gender}
              name={name}
              isBlurred={profilePhoto?.is_blurred}
              className="size-36 rounded-2xl border-4 border-white shadow-[0_10px_30px_rgba(127,29,29,0.15)]"
              showMessage={false}
            />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[28px] font-extrabold tracking-[-0.02em] whitespace-nowrap text-primary-deep">
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
            <div className="mt-2.5 flex items-center gap-1.5 text-[13px] font-bold text-primary">
              <Camera className="size-3.5" /> {photos.length} photo{photos.length === 1 ? "" : "s"}
            </div>

            <div className="mt-5 flex items-center gap-2.5">
              <InterestButton memberId={member.id} size="cta" />
              <ContactButton memberId={member.id} size="cta" />
              <MessageButton memberId={member.id} size="icon-cta" />
              <ShortlistButton memberId={member.id} size="icon-cta" />
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button variant="outline" size="icon-cta" aria-label="Share" onClick={() => shareProfile(name)}>
                      <Share2 className="size-4.5" />
                    </Button>
                  }
                />
                <TooltipContent>Share</TooltipContent>
              </Tooltip>
              <ProfileMoreMenu
                memberId={member.id}
                name={name}
                renderTrigger={({ onClick }) => (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button variant="outline" size="icon-cta" aria-label="More" onClick={onClick}>
                          <MoreHorizontal className="size-4.5" />
                        </Button>
                      }
                    />
                    <TooltipContent>More</TooltipContent>
                  </Tooltip>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE HERO */}
      <div className="lg:hidden">
        <div className="relative">
          <button
            type="button"
            className="block w-full cursor-zoom-in disabled:cursor-default"
            onClick={() => setLightboxIndex(profilePhotoIndex)}
            disabled={!profilePhoto}
          >
            <MemberProfilePhoto
              photoUrl={profilePhoto?.photo_url ?? null}
              approvalStatus={profilePhoto?.approval_status ?? null}
              isBlurred={profilePhoto?.is_blurred}
              gender={member.gender}
              name={name}
              className="h-105 w-full"
              showMessage={false}
            />
          </button>
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
              <ProfileMoreMenu
                memberId={member.id}
                name={name}
                renderTrigger={({ onClick }) => (
                  <button
                    onClick={onClick}
                    className="flex size-10.5 items-center justify-center rounded-xl bg-white/92 text-primary-deep"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                )}
              />
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

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos.map((p) => ({ url: p.photo_url, isBlurred: p.is_blurred }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
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
