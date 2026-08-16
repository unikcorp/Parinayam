"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LightboxPhoto {
  url: string;
  isBlurred?: boolean;
}

export function PhotoLightbox({
  photos,
  index,
  onClose,
  onIndexChange,
}: {
  photos: LightboxPhoto[];
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const photo = photos[index];

  useEffect(() => {
    if (!photo) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + photos.length) % photos.length);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [photo, index, photos.length, onClose, onIndexChange]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="size-5" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index - 1 + photos.length) % photos.length);
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index + 1) % photos.length);
            }}
            aria-label="Next photo"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}

      <div className="relative max-h-[85vh] max-w-full" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt="Profile photo"
          className={cn("max-h-[85vh] max-w-full rounded-lg object-contain", photo.isBlurred && "scale-105 blur-xl")}
        />
        {photo.isBlurred && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/40 text-center text-white">
            <Lock className="size-6" />
            <span className="text-sm font-bold">Restricted</span>
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-white/80">
          {index + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}
