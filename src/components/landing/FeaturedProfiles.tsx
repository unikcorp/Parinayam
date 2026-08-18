import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/profile/profile-card";
import { Reveal } from "@/components/shared/reveal";
import type { FeaturedProfile } from "@/types/profile";

export interface FeaturedProfilesProps {
  profiles: FeaturedProfile[];
}

export function FeaturedProfiles({ profiles }: FeaturedProfilesProps) {
  if (profiles.length === 0) return null;

  return (
    <section className="bg-card py-9 pl-5 lg:px-18 lg:py-20">
      <div className="mb-5 flex items-end justify-between pr-5 lg:mb-10 lg:pr-0">
        <div>
          <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
            Featured profiles
          </div>
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-4xl">
            Premium members <span className="hidden lg:inline">near you</span>
          </h2>
        </div>
        <Button variant="outline" className="hidden lg:inline-flex" render={<Link href="/featured-profiles" />}>
          View all profiles →
        </Button>
        <Link href="/featured-profiles" className="text-[13px] font-bold text-primary lg:hidden">
          View all →
        </Link>
      </div>
      <div className="pn-scroll-x flex gap-3.5 overflow-x-auto pr-5 [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pr-0 [&::-webkit-scrollbar]:hidden">
        {profiles.map((p, i) => (
          <Reveal key={p.id} delay={i * 100} className="shrink-0 lg:w-auto">
            <ProfileCard
              teaser
              name={p.name}
              age={p.age}
              gender={p.gender}
              occupation={p.occupation ?? "—"}
              location={p.place}
              photoUrl={p.photoUrl}
              premium={p.isPremium}
              verified={p.verified}
              className="w-55 shrink-0 lg:w-auto"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
