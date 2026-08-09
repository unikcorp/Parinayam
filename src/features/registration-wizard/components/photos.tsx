"use client";

import { useState } from "react";
import { Loader2, X, ImagePlus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ImageCropUpload, ImageCropperDialog, validateImageFile, type CroppedImageResult } from "@/components/image-crop-upload";
import { uploadGalleryPhotoRequest, uploadProfilePhotoRequest } from "../api";
import { ApiError } from "@/lib/api";
import type { RegistrationFormValues } from "../schema";
import { MAX_REGISTRATION_PHOTOS as MAX_PHOTOS } from "@/constants/registration";

const MAX_GALLERY_PHOTOS = MAX_PHOTOS - 1;

export function PhotosStep({ memberId }: { memberId: number | null }) {
  const { setValue } = useFormContext<RegistrationFormValues>();
  const [profileImage, setProfileImage] = useState<CroppedImageResult | null>(null);
  const [profileUploading, setProfileUploading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<CroppedImageResult[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryDragOver, setGalleryDragOver] = useState(false);

  const [pendingGallerySrc, setPendingGallerySrc] = useState<string | null>(null);
  const [pendingGalleryName, setPendingGalleryName] = useState("gallery-photo.jpg");
  const [galleryError, setGalleryError] = useState<string | null>(null);

  const syncPhotoCount = (hasProfile: boolean, galleryCount: number) => {
    setValue("photoCount", (hasProfile ? 1 : 0) + galleryCount);
  };

  // Uploads happen the moment a photo is cropped, not deferred to the final
  // submit — same rule admin's wizard follows — so the photo already exists
  // even if the member exits right after this step.
  const handleProfileImageChange = async (result: CroppedImageResult | null) => {
    setProfileImage(result);
    syncPhotoCount(!!result, galleryImages.length);
    setProfileError(null);
    if (!result || !memberId) return;

    setProfileUploading(true);
    try {
      await uploadProfilePhotoRequest(memberId, result.file);
    } catch (error) {
      setProfileError(error instanceof ApiError ? error.message : "Could not upload the profile photo.");
    } finally {
      setProfileUploading(false);
    }
  };

  const handleGalleryFileSelect = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (galleryImages.length >= MAX_GALLERY_PHOTOS) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setGalleryError(validationError);
      return;
    }

    setGalleryError(null);
    setPendingGalleryName(`${file.name.replace(/\.[^./]+$/, "")}.jpg`);
    setPendingGallerySrc(URL.createObjectURL(file));
  };

  const closeGalleryCropper = () => {
    if (pendingGallerySrc) URL.revokeObjectURL(pendingGallerySrc);
    setPendingGallerySrc(null);
  };

  const handleGalleryCropSave = async (result: CroppedImageResult) => {
    const next = [...galleryImages, result];
    setGalleryImages(next);
    closeGalleryCropper();
    syncPhotoCount(!!profileImage, next.length);
    if (!memberId) return;

    setGalleryUploading(true);
    try {
      await uploadGalleryPhotoRequest(memberId, result.file);
    } catch (error) {
      setGalleryError(error instanceof ApiError ? error.message : "Could not upload the gallery photo.");
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryPhoto = (url: string) => {
    setGalleryImages((prev) => {
      const target = prev.find((p) => p.url === url);
      if (target) URL.revokeObjectURL(target.url);
      const next = prev.filter((p) => p.url !== url);
      syncPhotoCount(!!profileImage, next.length);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="mb-3 text-[13px] font-bold text-primary-deep">Profile photo</p>
        <ImageCropUpload
          value={profileImage}
          onChange={handleProfileImageChange}
          aspect={1}
          shape="rect"
          label="Upload profile photo"
          disabled={profileUploading}
        />
        {profileUploading && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-faint">
            <Loader2 className="size-3.5 animate-spin" /> Uploading…
          </p>
        )}
        {profileError && <p className="mt-2 text-xs font-semibold text-destructive">{profileError}</p>}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[13px] font-bold text-primary-deep">Gallery photos</p>
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-faint">
            {galleryUploading && <Loader2 className="size-3.5 animate-spin" />}
            {galleryImages.length} / {MAX_GALLERY_PHOTOS}
          </span>
        </div>
        <p className="mb-4 text-sm leading-[1.6] text-muted-foreground">
          Add up to {MAX_GALLERY_PHOTOS} more photos — each gets the same square crop as your profile photo.
        </p>

        {galleryImages.length < MAX_GALLERY_PHOTOS && (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setGalleryDragOver(true);
            }}
            onDragLeave={() => setGalleryDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setGalleryDragOver(false);
              handleGalleryFileSelect(e.dataTransfer.files);
            }}
            className={`mb-4 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 cursor-pointer transition-colors ${
              galleryDragOver ? "border-primary bg-surface-blue" : "border-input hover:border-primary"
            }`}
          >
            <ImagePlus className="size-6 text-primary" />
            <p className="text-sm font-semibold text-primary-deep">Drag & drop a photo, or click to browse</p>
            <p className="text-xs text-faint">One at a time — you&apos;ll crop it next</p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                handleGalleryFileSelect(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        )}

        {galleryError && <p className="mb-3 text-xs font-semibold text-destructive">{galleryError}</p>}

        {galleryImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galleryImages.map((photo) => (
              <div key={photo.url} className="group relative aspect-square overflow-hidden rounded-xl border border-card-border">
                <img src={photo.url} alt="Gallery" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryPhoto(photo.url)}
                  className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {pendingGallerySrc && (
          <ImageCropperDialog
            open
            imageSrc={pendingGallerySrc}
            aspect={1}
            shape="rect"
            fileName={pendingGalleryName}
            onCancel={closeGalleryCropper}
            onSave={handleGalleryCropSave}
          />
        )}
      </div>
    </div>
  );
}
