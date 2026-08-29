"use client";

import type { Advertisement } from "@/hooks/use-advertisements";
import { advertisementImageUrl } from "@/hooks/use-advertisements";

// Persistent right-hand rail shown alongside every registration step — the
// admin-uploaded ad (Site Settings > Advertise) with the lowest display_order.
export function RegistrationAdPanel({ ad }: { ad: Advertisement | undefined }) {
  const imageUrl = ad ? advertisementImageUrl(ad.image) : null;
  if (!ad || !imageUrl) return null;

  const content = (
    <div className="animate-ad-glow group relative overflow-hidden rounded-2xl border border-card-border shadow-[0_8px_30px_rgba(127,29,29,0.05)] transition-all duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:scale-[1.025] hover:shadow-[0_24px_50px_rgba(224,122,31,0.28)]">
      <img src={imageUrl} alt={ad.title} className="w-full object-cover" />

      {/* diagonal shine sweep, plays once per hover */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-y-0 -left-1/2 hidden w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:block group-hover:animate-ad-sweep group-hover:opacity-100" />
      </div>

      {/* soft gold ring that brightens on hover, on top of the base pulsing glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-gold/60" />

      {/* "Sponsored" badge — fades in, holds, then fades out while still hovering */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3 opacity-0 group-hover:animate-ad-badge">
        <span className="rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-sm">
          Sponsored · Click to view
        </span>
      </div>
    </div>
  );

  return (
    <aside className="hidden lg:flex lg:items-center lg:justify-center lg:p-11">
      <div className="sticky top-1/2 w-full -translate-y-1/2">
        {ad.link_url ? (
          <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    </aside>
  );
}
