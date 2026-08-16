"use client";

import { useState } from "react";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import type { MemberProfilePhoto as MemberProfilePhotoData } from "@/types/member-profile";

export function Gallery({ photos, gender }: { photos: MemberProfilePhotoData[]; gender: "Male" | "Female" | string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  const shown = photos.slice(0, 4);
  const extra = Math.max(photos.length - 4, 0);

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden rounded-[20px] border border-card-border bg-card p-8 lg:block">
        <div className="mb-4.5 flex items-center justify-between">
          <div className="text-lg font-extrabold text-primary-deep">Gallery</div>
          <span className="text-[13px] font-bold text-primary">View all {photos.length} →</span>
        </div>
        <div className="grid grid-cols-4 gap-3.5">
          {shown.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className="relative cursor-zoom-in"
              onClick={() => setOpenIndex(i)}
            >
              <MemberProfilePhoto
                photoUrl={p.photo_url}
                approvalStatus={p.approval_status}
                isBlurred={p.is_blurred}
                gender={gender}
                className="h-42.5 w-full rounded-[14px]"
                showMessage={false}
              />
              {i === shown.length - 1 && extra > 0 && (
                <div className="absolute inset-0 flex items-center justify-center rounded-[14px] bg-primary-deep/55 text-lg font-extrabold text-white">
                  +{extra}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE STRIP */}
      <div className="lg:hidden">
        <div className="pn-scroll-x flex gap-2.5 overflow-x-auto bg-card px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {shown.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className="relative shrink-0 cursor-zoom-in"
              onClick={() => setOpenIndex(i)}
            >
              <MemberProfilePhoto
                photoUrl={p.photo_url}
                approvalStatus={p.approval_status}
                isBlurred={p.is_blurred}
                gender={gender}
                className="h-32.5 w-27.5 rounded-xl"
                showMessage={false}
              />
              {i === shown.length - 1 && extra > 0 && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-primary-deep/55 text-sm font-extrabold text-white">
                  +{extra}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <PhotoLightbox
          photos={photos.map((p) => ({ url: p.photo_url, isBlurred: p.is_blurred }))}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  );
}
