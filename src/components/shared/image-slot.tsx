import { useId } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
 * Dummy photo filler for design mockups. Renders a local placeholder image
 * (client/public) — no external image API/CDN — swap for next/image fed by
 * real member/CDN photos in production, per the design handoff's
 * white-label notes.
 */
export function ImageSlot({ label = "photo", className }: ImageSlotProps) {
  const id = useId();
  const hash = hashSeed(id);
  const isAvatar = className?.includes("rounded-full") ?? false;

  let src: string;
  let alt: string;
  if (isAvatar) {
    const gender = hash % 2 === 0 ? "men" : "women";
    src = gender === "men" ? "/images/men.png" : "/images/women.png";
    alt = "Placeholder portrait";
  } else {
    src = "/photos/couple.jpg";
    alt = "Placeholder photo";
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
