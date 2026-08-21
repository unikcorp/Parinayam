"use client";

import Image from "next/image";
import { ImageSlot } from "@/components/shared/image-slot";
import { MediaCardGridSkeleton } from "@/components/shared/loading-skeletons";

import { useSuccessStories } from "@/hooks/use-success-stories";

export default function SuccessStoriesPage() {
  const { data: stories, isLoading } = useSuccessStories();

  const allStories = stories ?? [];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface-cream">
      <section className="px-5 pt-9 pb-6 text-center lg:px-12 lg:pt-13 lg:pb-9">
        <div className="mb-2.5 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
          Success stories
        </div>
        <h1 className="mb-2.5 text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep lg:mb-3 lg:text-[44px]">
          Real couples, real weddings
        </h1>
        <p className="mx-auto mb-6 max-w-140 text-sm text-muted-foreground lg:mb-7 lg:text-[16.5px]">
          Real couples who met on {`Parinayam`}, in their own words.
        </p>
      </section>

      {isLoading ? (
        <section className="px-5 pb-12 lg:px-12">
          <MediaCardGridSkeleton />
        </section>
      ) : allStories.length === 0 ? (
        <p className="py-16 text-center text-sm text-faint">No success stories yet — check back soon.</p>
      ) : (
        <section className="px-5 pb-12 lg:px-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6.5">
            {allStories.map((s) => (
              <div
                key={s.id ?? s.couple}
                className="overflow-hidden rounded-2xl border border-[#F0E9DD] bg-card transition-all duration-200 lg:hover:-translate-y-1.5 lg:hover:shadow-card-hover"
              >
                <div className="relative">
                  {s.image ? (
                    <div className="relative h-45 w-full lg:h-60">
                      <Image
                        src={s.image}
                        alt={`${s.couple} — wedding photo`}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <ImageSlot label="Couple photo" className="h-45 w-full lg:h-60" />
                  )}
                  <span className="absolute bottom-3 left-3.5 rounded-full bg-white/94 px-3 py-1.5 text-xs font-extrabold text-primary-deep">
                    💍 {s.when}
                  </span>
                </div>
                <div className="p-5.5 lg:p-6">
                  <div className="text-lg font-extrabold text-primary-deep lg:text-[19px]">
                    {s.couple}
                  </div>
                  <div className="mt-1 mb-3 text-xs font-bold text-gold">{s.place}</div>
                  <p className="text-sm leading-[1.65] text-muted-foreground">&quot;{s.quote}&quot;</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
