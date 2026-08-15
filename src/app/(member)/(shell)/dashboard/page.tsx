"use client";

import Link from "next/link";
import {
  Heart,
  ArrowUpRight,
  Eye,
  Star,
  Check,
  Pencil,
  Camera,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useMyProfile } from "@/hooks/use-my-profile";
import { useSearchResults } from "@/hooks/use-search-results";
import { useReceivedInterests, useSentInterests } from "@/features/interests/use-interests";
import { useRecentlyViewed, useProfileVisitorCount } from "@/features/profile-views/use-profile-views";
import { useShortlistedYouCount } from "@/features/shortlist/use-shortlist";
import { AppMobileHeader } from "@/components/layout/app-mobile-header";
import { StatTile } from "@/components/shared/stat-tile";
import { ProfileCard } from "@/components/profile/profile-card";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { ProgressRing } from "@/components/shared/progress-ring";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const quickActions = [
  { icon: Pencil, label: "Edit profile", tint: "bg-surface-blue text-primary", href: "/profile/edit" },
  { icon: Camera, label: "Add photos", tint: "bg-peach-bg text-peach-text", href: "/profile/edit?step=photos" },
  { icon: Star, label: "Horoscope", tint: "bg-surface-cream-2 text-gold-text", href: "/profile/edit?step=horoscope" },
  { icon: Settings, label: "Preferences", tint: "bg-success-bg text-success", href: "/profile/edit?step=preferences" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: profile } = useMyProfile();
  const displayName = user?.name ?? "Member";
  const firstName = displayName.split(" ")[0];
  const completion = profile?.profileCompletion ?? 0;
  const profilePhoto = profile?.photos.find((p) => p.is_profile_photo);
  const hasPhotos = (profile?.photos.length ?? 0) > 0;
  const isVerified = !!profile?.document;
  const { data: suggested, isLoading: suggestedLoading } = useSearchResults({
    ageMin: 18,
    ageMax: 70,
    sort: "match",
    page: 1,
    limit: 6,
  });
  const suggestedMatches = suggested?.results ?? [];

  const { data: receivedInterests } = useReceivedInterests();
  const { data: sentInterests } = useSentInterests();
  const { data: recentlyViewed = [], isLoading: recentlyViewedLoading } = useRecentlyViewed();
  const { data: visitorCount } = useProfileVisitorCount();
  const { data: shortlistedYouCount } = useShortlistedYouCount();

  const tiles = [
    { icon: Heart, tint: "peach" as const, value: receivedInterests?.length ?? 0, label: "Interests received", href: "/interests" },
    { icon: ArrowUpRight, tint: "blue" as const, value: sentInterests?.length ?? 0, label: "Interests sent", href: "/interests" },
    { icon: Eye, tint: "gold" as const, value: visitorCount ?? 0, label: "Profile visitors" },
    { icon: Star, tint: "success" as const, value: shortlistedYouCount ?? 0, label: "Shortlisted you" },
  ];

  return (
    <>
      <AppMobileHeader
        greeting="Good morning 🌤"
        name={displayName}
        photoUrl={profilePhoto?.photo_url ?? null}
        approvalStatus={profilePhoto?.approval_status ?? null}
        gender={profile?.member.gender}
      />

      <div className="grid grid-cols-1 gap-6 px-5 py-5 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-7 lg:px-12 lg:py-8">
        {/* MAIN COLUMN */}
        <div className="flex flex-col gap-6 lg:gap-7">
          {/* welcome banner (desktop) */}
          <div className="bg-dark-panel-gradient hidden items-center justify-between rounded-[22px] px-8.5 py-7.5 text-white lg:flex">
            <div>
              <div className="text-2xl font-extrabold tracking-[-0.01em]">
                Good morning, {firstName} 🌤
              </div>
              <div className="mt-1.5 text-[14.5px] text-white/70">
                Keep your profile updated to get noticed by more matches.
              </div>
            </div>
            <Button variant="outline" className="border-white/20 bg-white/12 text-white hover:bg-white/20">
              View today&apos;s matches →
            </Button>
          </div>

          {/* welcome banner (mobile) */}
          <div className="bg-dark-panel-gradient rounded-2xl p-5 text-white lg:hidden">
            <div className="text-[15px] font-bold">Welcome back, {firstName}</div>
            <div className="mt-1 mb-3.5 text-xs text-white/70">
              Keep your profile updated to get noticed by more matches.
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-white/20 bg-white/12 text-white hover:bg-white/20"
            >
              View today&apos;s matches →
            </Button>
          </div>

          {/* stat tiles */}
          <div className="grid grid-cols-4 gap-2.5 lg:gap-4.5">
            {tiles.map(({ href, ...t }) =>
              href ? (
                <Link key={t.label} href={href}>
                  <StatTile {...t} className="p-3 text-center transition-shadow hover:shadow-card-hover lg:p-5 lg:text-left" />
                </Link>
              ) : (
                <StatTile key={t.label} {...t} className="p-3 text-center lg:p-5 lg:text-left" />
              )
            )}
          </div>

          {/* profile strength (mobile only, inline card) */}
          <Link
            href="/settings"
            className="flex items-center gap-4 rounded-2xl border border-card-border bg-card p-4.5 lg:hidden"
          >
            <ProgressRing percent={completion} size={62} strokeWidth={7} color="#0E9F6E" label={`${completion}%`} />
            <div className="flex-1">
              <div className="text-[15px] font-extrabold text-primary-deep">
                Profile strength: {strengthLabel(completion)}
              </div>
              <div className="mt-0.5 text-xs text-faint">{nextStepHint(hasPhotos, isVerified)}</div>
            </div>
            <span className="text-faint">›</span>
          </Link>

          {/* suggested matches */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-primary-deep lg:text-xl">
                Suggested for you
              </h2>
              <Link href="/search" className="text-sm font-bold text-primary">
                See all →
              </Link>
            </div>
            {suggestedLoading ? (
              <p className="py-6 text-center text-sm text-faint">Finding matches…</p>
            ) : suggestedMatches.length === 0 ? (
              <p className="py-6 text-center text-sm text-faint">
                No suggestions yet — widen your profile details to find more matches.
              </p>
            ) : (
              <div className="pn-scroll-x -mx-5 flex gap-3 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4.5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
                {suggestedMatches.map((m) => (
                  <ProfileCard
                    key={m.id}
                    memberId={m.id}
                    name={m.name}
                    age={m.age}
                    occupation={m.occupation ?? "—"}
                    location={m.place || "—"}
                    photoUrl={m.photoUrl}
                    gender={m.gender}
                    matchPercent={m.match ?? undefined}
                    verified={m.verified}
                    className="w-50 shrink-0 lg:w-auto"
                    photoClassName="h-45 lg:h-52.5"
                  />
                ))}
              </div>
            )}
          </section>

          {/* recently viewed */}
          {(recentlyViewedLoading || recentlyViewed.length > 0) && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-primary-deep lg:text-xl">
                  Recently viewed by you
                </h2>
                <Link href="/recently-viewed" className="text-sm font-bold text-primary">
                  See all →
                </Link>
              </div>
              {recentlyViewedLoading ? (
                <p className="py-6 text-center text-sm text-faint">Loading…</p>
              ) : (
                <div className="pn-scroll-x -mx-5 flex gap-3 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
                  {recentlyViewed.slice(0, 5).map((r) => (
                    <Link
                      key={r.id}
                      href={`/profile/${r.member_id}`}
                      className="w-24.5 shrink-0 rounded-2xl border border-card-border bg-card p-3.5 text-center transition-shadow hover:shadow-card-hover lg:w-auto lg:p-4"
                    >
                      <MemberProfilePhoto
                        photoUrl={r.photo_url}
                        approvalStatus={r.photo_url ? "APPROVED" : null}
                        gender={r.gender}
                        name={`${r.first_name} ${r.last_name}`}
                        className="mx-auto mb-2.5 size-17 rounded-full"
                        showMessage={false}
                      />
                      <div className="truncate text-[13.5px] font-bold text-primary-deep">
                        {r.first_name} {r.last_name}
                      </div>
                      <div className="mt-0.5 truncate text-[11.5px] text-faint">
                        {[r.district_name, r.state_name].filter(Boolean).join(", ") || "—"}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* RIGHT SIDEBAR (desktop only) */}
        <aside className="hidden flex-col gap-5 lg:flex">
          <div className="rounded-[20px] border border-card-border bg-card p-6">
            <div className="mb-4.5 flex items-center gap-4">
              <ProgressRing percent={completion} size={74} strokeWidth={8} color="#0E9F6E" label={`${completion}%`} />
              <div>
                <div className="text-base font-extrabold text-primary-deep">
                  Profile strength
                </div>
                <div className="mt-0.5 text-[13px] text-faint">{strengthLabel(completion)}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <div
                className={cn(
                  "flex items-center gap-2.5 text-[13.5px]",
                  hasPhotos ? "text-muted-foreground" : "text-faint"
                )}
              >
                {hasPhotos ? <Check className="size-4 text-success" /> : <span className="size-4" />} Photos added
              </div>
              <div
                className={cn(
                  "flex items-center gap-2.5 text-[13.5px]",
                  isVerified ? "text-muted-foreground" : "text-faint"
                )}
              >
                {isVerified ? <Check className="size-4 text-success" /> : <span className="size-4" />} ID verified
              </div>
              {!hasPhotos && (
                <Link
                  href="/profile/edit"
                  className="flex items-center justify-between rounded-[11px] bg-peach-bg px-3.5 py-2.5 text-[13.5px] font-bold text-primary-deep"
                >
                  <span>＋ Add photos</span>
                  <span className="text-peach-text">+9%</span>
                </Link>
              )}
              {!isVerified && (
                <Link
                  href="/profile/edit"
                  className="flex items-center justify-between rounded-[11px] bg-surface-cream-2 px-3.5 py-2.5 text-[13.5px] font-bold text-primary-deep"
                >
                  <span>＋ Verify your identity</span>
                  <span className="text-gold-text">+9%</span>
                </Link>
              )}
            </div>
          </div>

          <div className="bg-dark-panel-gradient rounded-[20px] p-5.5 text-white">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-extrabold tracking-[0.1em] text-gold-light">
                ★ PREMIUM
              </span>
              <span className="text-xs text-white/70">till Mar 2027</span>
            </div>
            <ProgressBar percent={68} variant="gold" trackClassName="bg-white/15" />
            <div className="mt-2 mb-3.5 text-xs text-white/70">
              68 of 100 contact views used
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/25 bg-white/10 text-white hover:bg-white/18"
            >
              Upgrade to Elite ♛
            </Button>
          </div>

          <div className="rounded-[20px] border border-card-border bg-card p-5.5">
            <div className="mb-3.5 text-base font-extrabold text-primary-deep">
              Quick actions
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {quickActions.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className={`rounded-xl px-2 py-3.5 text-center text-[12.5px] font-bold ${a.tint}`}
                >
                  <a.icon className="mx-auto mb-1.5 size-4" />
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function strengthLabel(percent: number) {
  if (percent >= 85) return "Strong — almost there!";
  if (percent >= 50) return "Getting there";
  return "Just started";
}

function nextStepHint(hasPhotos: boolean, isVerified: boolean) {
  if (!hasPhotos) return "Add photos for +9%";
  if (!isVerified) return "Verify your identity for +9%";
  return "Keep filling in your profile for better matches";
}
