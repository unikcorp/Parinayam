"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Advertisement } from "@/hooks/use-advertisements";
import { advertisementImageUrl } from "@/hooks/use-advertisements";

// Mobile-only equivalent of <RegistrationAdPanel> — on narrow screens there's
// no room for a persistent side rail while filling out the form, so instead
// the same admin-uploaded ad is shown once, as a dismissible popup, right
// after the member finishes registering. Desktop never shows this (it's
// already seen the side panel throughout), see register/page.tsx.
export function RegistrationAdPopup({
  ad,
  open,
  onClose,
}: {
  ad: Advertisement | undefined;
  open: boolean;
  onClose: () => void;
}) {
  const imageUrl = ad ? advertisementImageUrl(ad.image) : null;
  if (!ad || !imageUrl) return null;

  const image = <img src={imageUrl} alt={ad.title} className="w-full rounded-xl object-cover" />;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-sm overflow-hidden p-3">
        <DialogTitle className="sr-only">Sponsored offer</DialogTitle>
        <DialogDescription className="sr-only">A sponsored advertisement from our partners.</DialogDescription>

        <span className="mb-1 block text-center text-[11px] font-semibold tracking-wide text-faint uppercase">
          Sponsored
        </span>

        {ad.link_url ? (
          <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block">
            {image}
          </a>
        ) : (
          image
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white"
        >
          Continue to your dashboard →
        </button>
      </DialogContent>
    </Dialog>
  );
}
