"use client";

import { useParams } from "next/navigation";
import { Heart, Phone, Star } from "lucide-react";
import { ProfileHeader } from "@/components/profile/profile-header";
import { Gallery } from "@/components/profile/gallery";
import { DetailSectionCard, DetailAccordion } from "@/components/profile/detail-section";
import { PartnerMatchList } from "@/components/profile/partner-match-list";
import { CompatibilityCard } from "@/components/profile/compatibility-card";
import {
  MutualConnectionsCard,
  HoroscopeCard,
  SimilarProfilesList,
  SimilarProfilesRail,
} from "@/components/profile/sidebar-widgets";
import { StickyActionBar } from "@/components/shared/sticky-action-bar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: profile } = useProfile(id);

  if (!profile) return null;

  return (
    <>
      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 gap-5 px-5 py-5 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-7 lg:px-12 lg:py-8">
        {/* MAIN COLUMN */}
        <div className="flex flex-col gap-5 lg:gap-6">
          {/* AI summary */}
          <div className="rounded-2xl border border-[#EBE4F7] bg-[#F8F6FD] p-4.5 lg:rounded-[20px] lg:border-card-border lg:bg-card lg:p-7">
            <div className="mb-3 flex items-center gap-2.5 lg:mb-3.5">
              <span className="hidden text-lg font-extrabold text-primary-deep lg:inline">
                About {profile.name.split(" ")[0]}
              </span>
              <span className="rounded-full bg-[#F3F0FB] px-2.5 py-1 text-[11px] font-extrabold text-[#6B4DB3] lg:px-2.75">
                ✦ AI SUMMARY
              </span>
            </div>
            <p className="text-[13.5px] leading-[1.65] text-[#4A5568] lg:text-[15px] lg:leading-[1.75]">
              {profile.aiSummary}
            </p>
          </div>

          <Gallery photoCount={profile.photoCount} />

          {/* desktop detail cards */}
          <div className="hidden flex-col gap-6 lg:flex">
            {profile.sections.map((s) => (
              <DetailSectionCard key={s.key} section={s} />
            ))}
          </div>

          {/* mobile accordion */}
          <div className="px-5 lg:hidden">
            <DetailAccordion sections={[...profile.sections]} />
          </div>

          <div className="hidden lg:block">
            <PartnerMatchList name={profile.name} matches={profile.partnerPrefMatches} />
          </div>

          <div className="lg:hidden">
            <SimilarProfilesRail profiles={profile.similarProfiles} />
          </div>
        </div>

        {/* SIDEBAR (desktop) */}
        <aside className="hidden flex-col gap-5 lg:flex">
          <CompatibilityCard
            matchPercent={profile.matchPercent}
            porutham={profile.porutham}
            lifestyleMatch={profile.lifestyleMatch}
            trustScore={profile.trustScore}
          />
          <MutualConnectionsCard count={profile.mutualConnectionsCount} />
          <HoroscopeCard
            star={profile.horoscope.star}
            rasi={profile.horoscope.rasi}
            dosham={profile.horoscope.dosham}
            birthTimePlace={profile.horoscope.birthTimePlace}
            porutham={profile.porutham}
          />
          <SimilarProfilesList profiles={profile.similarProfiles} />
        </aside>
      </div>

      {/* MOBILE STICKY ACTION BAR */}
      <StickyActionBar className="lg:hidden">
        <Button variant="outline" size="icon-cta" aria-label="Shortlist">
          <Star className="size-4.5" />
        </Button>
        <Button size="cta" className="flex-1">
          <Heart className="size-4" /> Express Interest
        </Button>
        <Button variant="gold" size="icon-cta" aria-label="View contact">
          <Phone className="size-4.5" />
        </Button>
      </StickyActionBar>
    </>
  );
}
