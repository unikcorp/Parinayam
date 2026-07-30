import { Plus, X } from "lucide-react";
import type { RegistrationData } from "@/lib/registration/types";
import { ImageSlot } from "@/components/parinayam/image-slot";

const MAX_PHOTOS = 6;

export function PhotosStep({
  data,
  update,
}: {
  data: RegistrationData;
  update: <K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) => void;
}) {
  const slots = Array.from({ length: MAX_PHOTOS });

  return (
    <div>
      <p className="mb-6 text-sm leading-[1.6] text-muted-foreground">
        Add up to {MAX_PHOTOS} photos. Your first photo becomes your main
        profile picture — clear, recent photos get more interest.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {slots.map((_, i) => {
          const filled = i < data.photoCount;
          return (
            <button
              key={i}
              type="button"
              onClick={() =>
                update("photoCount", filled ? data.photoCount - 1 : data.photoCount + 1)
              }
              className="group relative aspect-3/4 overflow-hidden rounded-2xl border border-dashed border-input"
            >
              {filled ? (
                <>
                  <ImageSlot label={i === 0 ? "Main photo" : "Photo"} className="absolute inset-0" />
                  <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <X className="size-3.5" />
                  </span>
                  {i === 0 && (
                    <span className="absolute top-2 left-2 rounded-full bg-primary px-2.5 py-1 text-[10.5px] font-bold text-white">
                      Main
                    </span>
                  )}
                </>
              ) : (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted text-faint">
                  <Plus className="size-5" />
                  <span className="text-xs font-semibold">Add photo</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
