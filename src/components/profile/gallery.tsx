import { ImageSlot } from "@/components/parinayam/image-slot";
import { VoiceWave } from "@/components/parinayam/voice-wave";

export function Gallery({ photoCount }: { photoCount: number }) {
  const extra = Math.max(photoCount - 4, 0);
  return (
    <>
      {/* DESKTOP */}
      <div className="hidden rounded-[20px] border border-card-border bg-card p-8 lg:block">
        <div className="mb-4.5 flex items-center justify-between">
          <div className="text-lg font-extrabold text-primary-deep">Gallery</div>
          <span className="text-[13px] font-bold text-primary">View all {photoCount} →</span>
        </div>
        <div className="grid grid-cols-4 gap-3.5">
          {[0, 1, 2].map((i) => (
            <ImageSlot key={i} label="photo" className="h-42.5 w-full rounded-[14px]" />
          ))}
          <div className="relative">
            <ImageSlot label="photo" className="h-42.5 w-full rounded-[14px]" />
            {extra > 0 && (
              <div className="absolute inset-0 flex items-center justify-center rounded-[14px] bg-primary-deep/55 text-lg font-extrabold text-white">
                +{extra}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4.5">
          <VoiceWave duration="0:42" />
        </div>
      </div>

      {/* MOBILE STRIP */}
      <div className="lg:hidden">
        <div className="bg-card px-5 pt-1 pb-4.5">
          <VoiceWave duration="0:42" />
        </div>
        <div className="pn-scroll-x flex gap-2.5 overflow-x-auto bg-card px-5 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[0, 1, 2].map((i) => (
            <ImageSlot key={i} label="photo" className="h-32.5 w-27.5 shrink-0 rounded-xl" />
          ))}
          <div className="relative shrink-0">
            <ImageSlot label="photo" className="h-32.5 w-27.5 rounded-xl" />
            {extra > 0 && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-primary-deep/55 text-sm font-extrabold text-white">
                +{extra}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
