"use client";

import Link from "next/link";
import { Camera, Check, Pencil, Settings, ShieldCheck } from "lucide-react";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/shared/progress-ring";
import { DetailSectionCard, DetailAccordion, type DetailSectionData } from "@/components/profile/detail-section";
import { useMyProfile } from "@/hooks/use-my-profile";
import { calculateAge } from "@/types/member-profile";

const fallback = (v: string | number | null | undefined) => (v === null || v === undefined || v === "" ? "Not added yet" : String(v));

export default function MyProfilePage() {
  const { data, isLoading, isError } = useMyProfile();

  if (isLoading) {
    return <div className="flex items-center justify-center py-24 text-sm text-faint">Loading your profile…</div>;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-sm font-semibold text-destructive">Unable to load your profile.</p>
        <p className="text-sm text-faint">Please try again.</p>
      </div>
    );
  }

  const { member, horoscope, partnerPreference, photos, document, profileCompletion } = data;
  const profilePhoto = photos.find((p) => p.is_profile_photo);
  const age = calculateAge(member.dob);
  const location = [member.district_name, member.state_name, member.country_name].filter(Boolean).join(", ");

  const sections: DetailSectionData[] = [
    {
      key: "personal",
      icon: "lifestyle",
      title: "Personal details",
      rows: [
        ["Height", fallback(member.height)],
        ["Weight", fallback(member.weight)],
        ["Body type", fallback(member.body_type)],
        ["Complexion", fallback(member.complexion)],
        ["Physical status", fallback(member.physical_status)],
        ["Blood group", fallback(member.blood_group)],
        ["Mother tongue", fallback(member.mtongue_name)],
        ["Marital status", fallback(member.marital_status)],
      ],
    },
    {
      key: "religion",
      icon: "religion",
      title: "Religion & community",
      rows: [
        ["Religion", fallback(member.religion_name)],
        ["Caste", fallback(member.caste_name)],
        ["Sub caste", fallback(member.sub_caste_name)],
        ["Willing to marry outside caste", member.other_caste_allowed == null ? "Not added yet" : member.other_caste_allowed ? "Yes" : "No"],
      ],
    },
    {
      key: "education",
      icon: "education",
      title: "Education & career",
      rows: [
        ["Highest education", fallback(member.highest_education_name)],
        ["Field of study", fallback(member.field_of_study)],
        ["Occupation", fallback(member.occupation_name)],
        ["Company", fallback(member.company_name)],
        ["Annual income", fallback(member.annual_income_label)],
      ],
    },
    {
      key: "family",
      icon: "family",
      title: "Family details",
      rows: [
        ["Family type", fallback(member.family_type)],
        ["Family values", fallback(member.family_value)],
        ["Father's occupation", fallback(member.father_occupation)],
        ["Mother's occupation", fallback(member.mother_occupation)],
        ["Siblings", fallback(member.siblings)],
      ],
    },
    {
      key: "lifestyle",
      icon: "lifestyle",
      title: "Lifestyle",
      rows: [
        ["Diet", fallback(member.diet)],
        ["Smoking", fallback(member.smoking_habits)],
        ["Drinking", fallback(member.drinking_habits)],
      ],
    },
    {
      key: "horoscope",
      icon: "religion",
      title: "Horoscope",
      rows: [
        ["Star", fallback(horoscope?.star_name)],
        ["Dosham", fallback(horoscope?.dosh_name)],
        ["Birth time", fallback(horoscope?.birth_time)],
        ["Birth place", fallback(horoscope?.birth_place)],
      ],
    },
    {
      key: "preferences",
      icon: "family",
      title: "Partner preferences",
      rows: [
        ["Age range", partnerPreference ? `${fallback(partnerPreference.age_from)} - ${fallback(partnerPreference.age_to)}` : "Not added yet"],
        ["Min height", fallback(partnerPreference?.height_from)],
        ["About partner", fallback(partnerPreference?.about_partner)],
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-260 px-5 py-6 lg:px-12 lg:py-8">
      {/* HEADER */}
      <div className="mb-7 flex flex-col items-center gap-5 rounded-[22px] border border-card-border bg-card p-6 text-center lg:flex-row lg:items-start lg:gap-7 lg:p-8 lg:text-left">
        <div className="relative shrink-0">
          <MemberProfilePhoto
            photoUrl={profilePhoto?.photo_url ?? null}
            approvalStatus={profilePhoto?.approval_status ?? null}
            gender={member.gender}
            name={`${member.first_name} ${member.last_name}`}
            className="size-32 rounded-2xl border-4 border-white shadow-[0_10px_30px_rgba(127,29,29,0.15)] lg:size-36"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
            <span className="text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:text-[30px]">
              {member.first_name} {member.last_name}
            </span>
            {document?.status === "APPROVED" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-white">
                <ShieldCheck className="size-3.5" /> Verified
              </span>
            )}
          </div>
          <div className="mt-1.5 text-[14.5px] text-muted-foreground">{member.member_code}</div>
          <div className="mt-1 text-[15px] text-muted-foreground">
            {age} years • {member.gender}
            {location && <> • {location}</>}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <div className="flex items-center gap-3">
              <ProgressRing percent={profileCompletion} size={54} strokeWidth={6} color="#0E9F6E" label={`${profileCompletion}%`} />
              <div className="text-left text-[13px] text-faint">
                Profile completed
                <div className="text-sm font-bold text-primary-deep">{profileCompletion}%</div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2.5 lg:justify-start">
            <Button size="cta" render={<Link href="/profile/edit" />}>
              <Pencil className="size-4" /> Edit Profile
            </Button>
            <Button variant="outline" size="cta" render={<Link href="/settings" />}>
              <Settings className="size-4" /> Settings
            </Button>
          </div>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="mb-7">
          <div className="mb-3 flex items-center gap-2 text-lg font-extrabold text-primary-deep">
            <Camera className="size-4.5" /> Photos ({photos.length})
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {photos.map((p) => (
              <MemberProfilePhoto
                key={p.id}
                photoUrl={p.photo_url}
                approvalStatus={p.approval_status}
                gender={member.gender}
                className="h-28 w-28 shrink-0 rounded-xl border border-card-border"
                showMessage={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* desktop cards */}
      <div className="hidden flex-col gap-6 lg:flex">
        {sections.map((s) => (
          <DetailSectionCard key={s.key} section={s} />
        ))}
      </div>

      {/* mobile accordion */}
      <div className="lg:hidden">
        <DetailAccordion sections={sections} />
      </div>
    </div>
  );
}
