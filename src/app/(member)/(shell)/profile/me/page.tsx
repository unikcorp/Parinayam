"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, ImagePlus, Loader2, Pencil, Settings, ShieldCheck, Star, Trash2, X } from "lucide-react";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import { HighlightBadge } from "@/features/profile-highlight/components/HighlightBadge";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/shared/progress-ring";
import { DetailSectionCard, DetailAccordion } from "@/components/profile/detail-section";
import { ImageCropperDialog, validateImageFile, type CroppedImageResult } from "@/components/image-crop-upload";
import {
  useMyProfile,
  useUploadProfilePhoto,
  useUploadGalleryPhoto,
  useUpdatePhoto,
  useDeletePhoto,
} from "@/hooks/use-my-profile";
import { calculateAge } from "@/types/member-profile";
import { ApiError } from "@/lib/api";
import { MAX_REGISTRATION_PHOTOS } from "@/constants/registration";
import { cn } from "@/lib/utils";
import { buildProfileSections } from "@/lib/profile-sections";
import { ProfileDetailSkeleton } from "@/components/shared/loading-skeletons";

const MAX_GALLERY_PHOTOS = MAX_REGISTRATION_PHOTOS - 1;

export default function MyProfilePage() {
  const { data, isLoading, isError } = useMyProfile();
  const memberId = data?.member.id ?? null;

  const uploadProfilePhoto = useUploadProfilePhoto(memberId);
  const uploadGalleryPhoto = useUploadGalleryPhoto(memberId);
  const updatePhoto = useUpdatePhoto(memberId);
  const deletePhoto = useDeletePhoto(memberId);

  const [pendingProfileSrc, setPendingProfileSrc] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [pendingGallerySrc, setPendingGallerySrc] = useState<string | null>(null);
  // Set when the crop dialog was opened from a photo's own Update button —
  // routes the save to updatePhoto (replace in place) instead of add-new.
  const [pendingUpdatePhotoId, setPendingUpdatePhotoId] = useState<number | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-215 px-5 py-8 lg:px-6">
        <ProfileDetailSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-sm font-semibold text-destructive">Unable to load your profile.</p>
        <p className="text-sm text-faint">Please try again.</p>
      </div>
    );
  }

  const { member, horoscope, partnerPreference, photos, document, profileCompletion } = data;
  const profilePhoto = photos.find((p) => p.is_profile_photo);
  const galleryPhotos = photos.filter((p) => !p.is_profile_photo);
  const age = calculateAge(member.dob);
  const location = [member.district_name, member.state_name, member.country_name].filter(Boolean).join(", ");

  const openProfilePicker = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setProfileError(validationError);
      return;
    }
    setProfileError(null);
    setPendingProfileSrc(URL.createObjectURL(file));
  };

  const closeProfileCropper = () => {
    if (pendingProfileSrc) URL.revokeObjectURL(pendingProfileSrc);
    setPendingProfileSrc(null);
  };

  const handleProfileCropSave = async (result: CroppedImageResult) => {
    closeProfileCropper();
    try {
      await uploadProfilePhoto.mutateAsync(result.file);
    } catch (error) {
      setProfileError(error instanceof ApiError ? error.message : "Could not upload the profile photo.");
    }
  };

  const handleDeleteProfilePhoto = () => {
    if (!profilePhoto) return;
    if (!window.confirm("Remove your profile photo?")) return;
    deletePhoto.mutate(profilePhoto.id);
  };

  const openGalleryPicker = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (galleryPhotos.length >= MAX_GALLERY_PHOTOS) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setGalleryError(validationError);
      return;
    }
    setGalleryError(null);
    setPendingUpdatePhotoId(null);
    setPendingGallerySrc(URL.createObjectURL(file));
  };

  const openGalleryUpdatePicker = (photoId: number, files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setGalleryError(validationError);
      return;
    }
    setGalleryError(null);
    setPendingUpdatePhotoId(photoId);
    setPendingGallerySrc(URL.createObjectURL(file));
  };

  const closeGalleryCropper = () => {
    if (pendingGallerySrc) URL.revokeObjectURL(pendingGallerySrc);
    setPendingGallerySrc(null);
    setPendingUpdatePhotoId(null);
  };

  const handleGalleryCropSave = async (result: CroppedImageResult) => {
    const updatePhotoId = pendingUpdatePhotoId;
    closeGalleryCropper();
    try {
      if (updatePhotoId != null) {
        await updatePhoto.mutateAsync({ photoId: updatePhotoId, file: result.file });
      } else {
        await uploadGalleryPhoto.mutateAsync(result.file);
      }
    } catch (error) {
      setGalleryError(error instanceof ApiError ? error.message : "Could not save the gallery photo.");
    }
  };

  const handleDeleteGalleryPhoto = (photoId: number) => {
    if (!window.confirm("Delete this photo?")) return;
    deletePhoto.mutate(photoId);
  };

  const sections = buildProfileSections({ member, horoscope, partnerPreference, editable: true });

  return (
    <div className="mx-auto max-w-260 px-5 py-6 lg:px-12 lg:py-8">
      {/* HEADER */}
      <div className="mb-7 flex flex-col items-center gap-5 rounded-[22px] border border-card-border bg-card p-6 text-center lg:flex-row lg:items-start lg:gap-7 lg:p-8 lg:text-left">
        <div
          className={cn(
            "relative shrink-0",
            data.isHighlighted && "bg-highlight-ring-gradient animate-highlight-glow rounded-[22px] p-[3px]"
          )}
        >
          <button
            type="button"
            className="relative block cursor-zoom-in"
            onClick={() => profilePhoto && setLightboxOpen(true)}
            disabled={!profilePhoto}
          >
            <MemberProfilePhoto
              photoUrl={profilePhoto?.photo_url ?? null}
              approvalStatus={profilePhoto?.approval_status ?? null}
              gender={member.gender}
              name={`${member.first_name} ${member.last_name}`}
              className={cn(
                "rounded-2xl shadow-[0_10px_30px_rgba(127,29,29,0.15)]",
                data.isHighlighted ? "size-44 lg:size-56" : "size-32 border-4 border-white lg:size-44"
              )}
            />
            {data.isHighlighted && (
              <HighlightBadge isHighlighted className="absolute -bottom-2 left-1/2 -translate-x-1/2" />
            )}
          </button>

          <div className="absolute -right-1.5 -bottom-1.5 flex items-center gap-1.5">
            {profilePhoto && (
              <button
                type="button"
                onClick={handleDeleteProfilePhoto}
                disabled={deletePhoto.isPending}
                aria-label="Remove profile photo"
                className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-destructive text-white shadow-md transition-transform hover:scale-105 disabled:opacity-60"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
            <label
              aria-label={profilePhoto ? "Change profile photo" : "Upload profile photo"}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-md transition-transform hover:scale-105"
            >
              {uploadProfilePhoto.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Camera className="size-3.5" />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  openProfilePicker(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>

        <div className="flex-1">
          {profileError && <p className="mb-2 text-xs font-semibold text-destructive">{profileError}</p>}

          <div className="flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
            <span className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-[30px]">
              {member.first_name} {member.last_name}
            </span>
            {document?.status === "APPROVED" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1 text-xs font-extrabold text-white">
                <ShieldCheck className="size-3.5" /> Verified
              </span>
            )}
            {document?.status === "PENDING" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-700">
                Document pending admin approval
              </span>
            )}
            {document?.status === "REJECTED" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-xs font-extrabold text-destructive">
                Document rejected{document.rejection_reason ? `: ${document.rejection_reason}` : ""}
              </span>
            )}
          </div>
          <div className="mt-1.5 text-[14.5px] text-muted-foreground">{member.member_code}</div>
          <div className="mt-1 text-[15px] text-muted-foreground">
            {age} years • {member.gender}
            {location && <> • {location}</>}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <div className="flex items-center gap-3">
              <ProgressRing percent={profileCompletion} size={54} strokeWidth={6} color="#0E9F6E" label={`${profileCompletion}%`} />
              <div className="text-left text-[13px] text-faint">
                Profile completed
                <div className="text-sm font-bold text-primary-deep">{profileCompletion}%</div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2.5 lg:justify-start">
            <Button size="cta" render={<Link href="/profile/edit" />}>
              <Pencil className="size-4" /> Edit Profile
            </Button>
            <Button variant="outline" size="cta" render={<Link href="/shortlist" />}>
              <Star className="size-4" /> My Shortlist
            </Button>
            <Button variant="outline" size="cta" render={<Link href="/settings" />}>
              <Settings className="size-4" /> Settings
            </Button>
          </div>
        </div>
      </div>

      {/* GALLERY — kept separate from the profile detail cards below */}
      <div className="mb-7 rounded-[20px] border border-card-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-extrabold text-primary-deep">
            <Camera className="size-4.5" /> Gallery
          </div>
          <span className="text-[13px] font-semibold text-faint">
            {galleryPhotos.length} / {MAX_GALLERY_PHOTOS}
          </span>
        </div>

        {galleryError && <p className="mb-3 text-xs font-semibold text-destructive">{galleryError}</p>}

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {galleryPhotos.map((p) => (
            <div key={p.id} className="group relative aspect-square overflow-hidden rounded-xl border border-card-border">
              <MemberProfilePhoto
                photoUrl={p.photo_url}
                approvalStatus={p.approval_status}
                gender={member.gender}
                className="size-full rounded-none"
              />
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <label
                  aria-label="Update photo"
                  className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white"
                >
                  {updatePhoto.isPending && updatePhoto.variables?.photoId === p.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Camera className="size-3.5" />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      openGalleryUpdatePicker(p.id, e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleDeleteGalleryPhoto(p.id)}
                  disabled={deletePhoto.isPending}
                  aria-label="Delete photo"
                  className="flex size-6 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-60"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          ))}

          {galleryPhotos.length < MAX_GALLERY_PHOTOS && (
            <label
              aria-label="Add gallery photo"
              className={cn(
                "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-input text-faint transition-colors hover:border-primary hover:text-primary"
              )}
            >
              {uploadGalleryPhoto.isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="size-5" />
                  <span className="text-[11px] font-bold">Add photo</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  openGalleryPicker(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
      </div>

      {/* ABOUT ME — moderated free text; only the owner sees the
          pending/rejected state, other members simply never receive
          unapproved text from the server. */}
      <div className="mb-7 rounded-2xl border border-card-border bg-card p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-extrabold text-primary-deep">About {member.first_name}</div>
          <Link href="/profile/edit?step=about" className="text-[13px] font-bold text-primary">
            Edit
          </Link>
        </div>
        {member.about_me ? (
          member.about_me_status === "APPROVED" ? (
            <p className="text-[15px] leading-[1.75] text-[#4A5568]">{member.about_me}</p>
          ) : member.about_me_status === "REJECTED" ? (
            <p className="text-sm font-semibold text-destructive">
              Rejected by admin{member.about_me_rejection_reason ? `: ${member.about_me_rejection_reason}` : ""} — please edit and resubmit.
            </p>
          ) : (
            <p className="text-sm font-semibold text-amber-700">Waiting for admin approval.</p>
          )
        ) : (
          <p className="text-sm text-faint">Not added yet.</p>
        )}
      </div>

      {/* desktop cards */}
      <div className="hidden flex-col gap-6 lg:flex">
        {sections.map((s) => (
          <DetailSectionCard key={s.key} section={s} />
        ))}
      </div>

      {/* mobile accordion */}
      <div className="lg:hidden">
        <DetailAccordion sections={sections} />
      </div>

      {lightboxOpen && profilePhoto && (
        <PhotoLightbox
          photos={[{ url: profilePhoto.photo_url, isBlurred: false }]}
          index={0}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={() => {}}
        />
      )}

      {pendingProfileSrc && (
        <ImageCropperDialog
          open
          imageSrc={pendingProfileSrc}
          aspect={1}
          shape="rect"
          fileName="profile-photo.jpg"
          onCancel={closeProfileCropper}
          onSave={handleProfileCropSave}
        />
      )}

      {pendingGallerySrc && (
        <ImageCropperDialog
          open
          imageSrc={pendingGallerySrc}
          aspect={1}
          shape="rect"
          fileName="gallery-photo.jpg"
          onCancel={closeGalleryCropper}
          onSave={handleGalleryCropSave}
        />
      )}
    </div>
  );
}
