"use client";

import { useParams } from "next/navigation";
import { ProfileHeader } from "@/components/profile/profile-header";
import { Gallery } from "@/components/profile/gallery";
import { DetailSectionCard, DetailAccordion } from "@/components/profile/detail-section";
import { HoroscopeCard } from "@/components/profile/sidebar-widgets";
import { ContactButton } from "@/components/profile/contact-button";
import { BlockedProfileState } from "@/components/profile/blocked-profile-state";
import { StickyActionBar } from "@/components/shared/sticky-action-bar";
import { InterestButton } from "@/features/interests/components/InterestButton";
import { MessageButton } from "@/features/messaging/components/MessageButton";
import { ShortlistButton } from "@/features/shortlist/components/ShortlistButton";
import { useProfile } from "@/hooks/use-profile";
import { buildProfileSections } from "@/lib/profile-sections";
import { ApiError } from "@/lib/api";

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: profile, isLoading, isError, error } = useProfile(id);

  if (isLoading) {
    return <div className="flex items-center justify-center py-24 text-sm text-faint">Loading profile…</div>;
  }

  if (error instanceof ApiError && error.status === 403) {
    return <BlockedProfileState memberId={Number(id)} />;
  }

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-sm font-semibold text-destructive">This profile isn&apos;t available.</p>
        <p className="text-sm text-faint">It may have been removed, or you may not have permission to view it.</p>
      </div>
    );
  }

  const { member, horoscope, partnerPreference, photos } = profile;
  const sections = buildProfileSections({ member, horoscope, partnerPreference, editable: false });

  return (
    <>
      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 gap-5 px-5 py-5 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-7 lg:px-12 lg:py-8">
        {/* MAIN COLUMN */}
        <div className="flex flex-col gap-5 lg:gap-6">
          {member.about_me && (
            <div className="rounded-2xl border border-[#EBE4F7] bg-[#F8F6FD] p-4.5 lg:rounded-[20px] lg:border-card-border lg:bg-card lg:p-7">
              <div className="mb-3 text-lg font-extrabold text-primary-deep lg:mb-3.5">
                About {member.first_name}
              </div>
              <p className="text-[13.5px] leading-[1.65] text-[#4A5568] lg:text-[15px] lg:leading-[1.75]">
                {member.about_me}
              </p>
            </div>
          )}

          <Gallery photos={photos} gender={member.gender} />

          {/* desktop detail cards */}
          <div className="hidden flex-col gap-6 lg:flex">
            {sections.map((s) => (
              <DetailSectionCard key={s.key} section={s} />
            ))}
          </div>

          {/* mobile accordion */}
          <div className="px-5 lg:hidden">
            <DetailAccordion sections={sections} />
          </div>
        </div>

        {/* SIDEBAR (desktop) */}
        {horoscope && (
          <aside className="hidden flex-col gap-5 lg:flex">
            <HoroscopeCard
              star={horoscope.star_name ?? "Not added yet"}
              dosham={horoscope.dosh_name ?? "Not added yet"}
              birthTimePlace={[horoscope.birth_time, horoscope.birth_place].filter(Boolean).join(" · ") || "Not added yet"}
              note={horoscope.horoscope_note}
            />
          </aside>
        )}
      </div>

      {/* MOBILE STICKY ACTION BAR */}
      <StickyActionBar className="lg:hidden">
        <ShortlistButton memberId={member.id} size="icon-cta" />
        <InterestButton memberId={member.id} size="cta" className="flex-1" />
        <MessageButton memberId={member.id} size="icon-cta" variant="outline" />
        <ContactButton memberId={member.id} size="icon-cta" iconOnly />
      </StickyActionBar>
    </>
  );
}
