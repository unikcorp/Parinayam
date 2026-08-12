"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { ImageSlot } from "@/components/shared/image-slot";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/shared/progress-ring";
import { useMyProfile } from "@/hooks/use-my-profile";
import { calculateAge } from "@/types/member-profile";

const editSections = [
  { label: "Personal details", desc: "Height, appearance, community, location" },
  { label: "Education & career", desc: "Highest education, occupation, income" },
  { label: "Family details", desc: "Family type, parents, siblings" },
  { label: "Horoscope", desc: "Star, dosham, birth details" },
  { label: "About you", desc: "A few lines for your profile" },
  { label: "Partner preferences", desc: "Who you're looking for" },
  { label: "Photos", desc: "Profile & gallery photos" },
  { label: "Identity verification", desc: "ID document" },
];

export default function ProfileSettingsPage() {
  const { data, isLoading, isError } = useMyProfile();

  if (isLoading) {
    return <div className="py-16 text-center text-sm text-faint">Loading your profile…</div>;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-sm font-semibold text-destructive">Unable to load your profile.</p>
        <p className="text-sm text-faint">Please try again.</p>
      </div>
    );
  }

  const { member, profileCompletion, photos } = data;
  const profilePhoto = photos.find((p) => p.is_profile_photo) ?? photos[0];

  return (
    <div className="flex flex-col gap-5.5">
      <div className="hidden items-center justify-between lg:flex">
        <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep">Profile Settings</h1>
        <Button size="cta" render={<Link href="/profile/edit" />}>
          <Pencil className="size-4" /> Edit Profile
        </Button>
      </div>

      <section className="flex items-center gap-4 rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-7">
        {profilePhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profilePhoto.photo_url}
            alt={`${member.first_name} ${member.last_name}`}
            className="size-16 shrink-0 rounded-full border-2 border-gold-light object-cover lg:size-20"
          />
        ) : (
          <ImageSlot label="you" className="size-16 shrink-0 rounded-full border-2 border-gold-light lg:size-20" />
        )}
        <div className="flex-1">
          <div className="text-base font-extrabold text-primary-deep lg:text-lg">
            {member.first_name} {member.last_name}
          </div>
          <div className="mt-0.5 text-xs text-faint lg:text-sm">
            {member.member_code} · {calculateAge(member.dob)} years · {member.gender}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <ProgressRing percent={profileCompletion} size={48} strokeWidth={5} color="#0E9F6E" label={`${profileCompletion}%`} />
        </div>
      </section>

      <section className="rounded-2xl border border-card-border bg-card p-2 lg:rounded-[20px] lg:p-3">
        {editSections.map((s, i) => (
          <Link
            key={s.label}
            href="/profile/edit"
            className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-3.5 hover:bg-surface ${
              i !== editSections.length - 1 ? "border-b border-[#F5F6F9]" : ""
            }`}
          >
            <div>
              <div className="text-sm font-bold text-ink">{s.label}</div>
              <div className="mt-0.5 text-xs text-faint">{s.desc}</div>
            </div>
            <span className="text-xs font-bold text-primary">Edit →</span>
          </Link>
        ))}
      </section>

      <Link
        href="/profile/me"
        className="text-center text-sm font-bold text-primary lg:text-left"
      >
        View my public profile →
      </Link>
    </div>
  );
}
