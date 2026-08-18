import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/shared/image-slot";
import { Reveal } from "@/components/shared/reveal";
import { homeStories } from "@/data/stories.data";

function StoryCard({
  story,
  imgClassName,
  compact,
}: {
  story: (typeof homeStories)[number];
  imgClassName: string;
  compact?: boolean;
}) {
  return (
    <div className="group h-full overflow-hidden rounded-2xl border border-[#F0E9DD] bg-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-card-hover">
      <div className="overflow-hidden">
        <ImageSlot
          label="Couple photo — wedding"
          className={`w-full transition-transform duration-500 ease-out group-hover:scale-105 ${imgClassName}`}
        />
      </div>
      <div className={compact ? "p-4" : "p-4.5 lg:p-6"}>
        <div className={compact ? "text-sm font-extrabold text-primary-deep" : "text-base font-extrabold text-primary-deep lg:text-[19px]"}>
          {story.couple}
        </div>
        <div className={compact ? "mt-0.5 mb-1.5 text-[11px] font-semibold text-gold" : "mt-1 mb-2 text-xs font-semibold text-gold lg:mb-3"}>
          Married {story.when} · {story.place}
        </div>
        <p className={compact ? "text-[12.5px] leading-[1.55] text-muted-foreground" : "text-[13px] leading-[1.6] text-muted-foreground lg:text-[15px] lg:leading-[1.65]"}>
          &ldquo;{story.quote}&rdquo;
        </p>
      </div>
    </div>
  );
}

export function SuccessStories() {
  return (
    <section id="stories" className="bg-surface-cream py-9 pl-5 lg:px-18 lg:py-20">
      <div className="mb-5 flex items-end justify-between pr-5 lg:mb-10 lg:pr-0">
        <div>
          <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
            Success stories
          </div>
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-4xl">
            3,200+ marriages and counting
          </h2>
        </div>
        <Button variant="outline" className="hidden lg:inline-flex" render={<Link href="/stories" />}>
          View all stories →
        </Button>
        <Link href="/stories" className="text-[13px] font-bold text-primary lg:hidden">
          View all →
        </Link>
      </div>

      {/* mobile: uniform horizontal scroll */}
      <div className="pn-scroll-x flex gap-3.5 overflow-x-auto pr-5 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
        {homeStories.map((story, i) => (
          <Reveal key={story.couple} delay={i * 120} className="w-65 shrink-0">
            <StoryCard story={story} imgClassName="h-42.5" />
          </Reveal>
        ))}
      </div>

      {/* desktop: featured story + two stacked */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-7">
        <Reveal className="lg:col-span-2">
          <StoryCard story={homeStories[0]} imgClassName="h-72" />
        </Reveal>
        <div className="flex flex-col gap-7">
          {homeStories.slice(1).map((story, i) => (
            <Reveal key={story.couple} delay={(i + 1) * 120} className="flex-1">
              <StoryCard story={story} imgClassName="h-32" compact />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
