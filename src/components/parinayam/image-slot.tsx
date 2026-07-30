import { useId } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { avatarPhotos, scenePhotos } from "@/lib/stock-photos";

export interface ImageSlotProps {
  label?: string;
  className?: string;
}

// Deterministic (SSR/client-stable) hash so each slot picks a consistent
// photo without needing a manually-passed seed prop.
function hashSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Dummy photo filler for design mockups. Renders a curated South Indian
 * portrait or wedding/couple photo (from Unsplash, see
 * scripts/fetch-stock-photos.mjs) — swap for next/image fed by real
 * member/CDN photos in production, per the design handoff's white-label
 * notes.
 */
export function ImageSlot({ label = "photo", className }: ImageSlotProps) {
  const id = useId();
  const hash = hashSeed(id);
  const isAvatar = className?.includes("rounded-full") ?? false;

  let src: string;
  let alt: string;
  if (isAvatar) {
    const gender = hash % 2 === 0 ? "men" : "women";
    const pool = avatarPhotos[gender];
    const photo = pool[hash % pool.length];
    src = photo.small;
    alt = photo.alt;
  } else {
    const photo = scenePhotos[hash % scenePhotos.length];
    src = photo.regular;
    alt = photo.alt;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[repeating-linear-gradient(45deg,#FCE8E8,#FCE8E8_10px,#F5F7FC_10px,#F5F7FC_20px)]",
        className
      )}
    >
      <Image
        src={src}
        alt={alt || label}
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}
