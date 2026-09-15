"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/shared/image-slot";
import { Reveal } from "@/components/shared/reveal";
import { useSuccessStories } from "@/hooks/use-success-stories";
import type { SuccessStory } from "@/types/content";

const DESCRIPTION_LIMIT = 140;

function StoryCard({
  story,
  imgClassName,
  compact,
  imgPosition = "object-center",
}: {
  story: SuccessStory;
  imgClassName: string;
  compact?: boolean;
  imgPosition?: string;
}) {
  const [showFullStory, setShowFullStory] = useState(false);

  const quote = story.quote ?? "";
  const shouldShowReadMore = quote.length > DESCRIPTION_LIMIT;

  const truncatedQuote = shouldShowReadMore
    ? `${quote.slice(0, DESCRIPTION_LIMIT).trimEnd()}…`
    : quote;

  return (
    <>
      <div className="group h-full overflow-hidden rounded-2xl border border-[#F0E9DD] bg-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-card-hover">
        <div className="overflow-hidden">
          {story.image ? (
            <div
              className={`relative w-full overflow-hidden transition-transform duration-500 ease-out group-hover:scale-105 ${imgClassName}`}
            >
              <Image
                src={story.image}
                alt={`${story.couple} — wedding photo`}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover ${imgPosition}`}
              />
            </div>
          ) : (
            <ImageSlot
              label="Couple photo — wedding"
              className={`w-full transition-transform duration-500 ease-out group-hover:scale-105 ${imgClassName}`}
            />
          )}
        </div>

        <div className={compact ? "p-4" : "p-4.5 lg:p-6"}>
          <div
            className={
              compact
                ? "text-sm font-extrabold text-primary-deep"
                : "text-base font-extrabold text-primary-deep lg:text-[19px]"
            }
          >
            {story.couple}
          </div>

          <div
            className={
              compact
                ? "mt-0.5 mb-1.5 text-[11px] font-semibold text-gold"
                : "mt-1 mb-2 text-xs font-semibold text-gold lg:mb-3"
            }
          >
            Married {story.when} · {story.place}
          </div>

          <div>
            <p
              className={
                compact
                  ? "text-[12.5px] leading-[1.55] text-muted-foreground"
                  : "text-[13px] leading-[1.6] text-muted-foreground lg:text-[15px] lg:leading-[1.65]"
              }
            >
              &ldquo;{truncatedQuote}&rdquo;
            </p>

            {shouldShowReadMore && (
              <button
                type="button"
                onClick={() => setShowFullStory(true)}
                className="mt-2 text-xs font-bold text-primary underline-offset-4 hover:underline"
              >
                Read More
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full story modal */}
      {showFullStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`story-title-${story.id ?? story.couple}`}
          onClick={() => setShowFullStory(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowFullStory(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              ×
            </button>

            <div className="pr-8">
              <h3
                id={`story-title-${story.id ?? story.couple}`}
                className="text-xl font-extrabold text-primary-deep"
              >
                {story.couple}
              </h3>

              <div className="mt-1 text-xs font-semibold text-gold">
                Married {story.when} · {story.place}
              </div>
            </div>

            <div className="mt-5 max-h-[60vh] overflow-y-auto">
              <p className="text-sm leading-7 text-muted-foreground">
                &ldquo;{quote}&rdquo;
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFullStory(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function SuccessStories() {
  const { data: stories } = useSuccessStories();
  const homeStories = (stories ?? []).slice(0, 3);

  if (homeStories.length === 0) return null;

  return (
    <section
      id="stories"
      className="bg-surface-cream py-9 pl-5 lg:px-18 lg:py-20"
    >
      <div className="mb-5 flex items-end justify-between pr-5 lg:mb-10 lg:pr-0">
        <div>
          <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
            Success stories
          </div>

          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-4xl">
            Real couples, real weddings
          </h2>
        </div>

        <Button
          variant="outline"
          className="hidden lg:inline-flex"
          render={<Link href="/stories" />}
        >
          View all stories →
        </Button>

        <Link
          href="/stories"
          className="text-[13px] font-bold text-primary lg:hidden"
        >
          View all →
        </Link>
      </div>

      {/* Mobile */}
      <div className="pn-scroll-x flex gap-3.5 overflow-x-auto pr-5 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
        {homeStories.map((story, i) => (
          <Reveal
            key={story.id ?? story.couple}
            delay={i * 120}
            className="w-65 shrink-0"
          >
            <StoryCard
              story={story}
              imgClassName="h-42.5"
              imgPosition="object-top"
            />
          </Reveal>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-7">
        <Reveal className="lg:col-span-2">
          <StoryCard
            story={homeStories[0]}
            imgClassName="h-105"
            imgPosition="object-top"
          />
        </Reveal>

        <div className="flex flex-col gap-7">
          {homeStories.slice(1).map((story, i) => (
            <Reveal
              key={story.id ?? story.couple}
              delay={(i + 1) * 120}
              className="flex-1"
            >
              <StoryCard
                story={story}
                imgClassName="h-32"
                imgPosition="object-top"
                compact
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}