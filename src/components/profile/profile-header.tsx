import { Camera, PlayCircle, Heart, Phone, Star, Share2, MoreHorizontal, ArrowLeft } from "lucide-react";
import { ImageSlot } from "@/components/parinayam/image-slot";
import { Button } from "@/components/ui/button";
import type { MockProfile } from "@/lib/mock/profile";

export function ProfileHeader({ profile }: { profile: MockProfile }) {
  return (
    <>
      {/* DESKTOP COVER */}
      <div className="hidden px-12 pt-6 lg:block">
        <div className="relative">
          <ImageSlot label="Cover photo — landscape" className="h-70 w-full rounded-3xl" />
          <div className="absolute bottom-16 left-11 flex items-end gap-6">
            <div className="relative">
              <ImageSlot
                label="Profile photo"
                className="size-38 rounded-full border-[6px] border-white shadow-[0_16px_40px_rgba(127,29,29,0.18)]"
              />
              {profile.online && (
                <span className="absolute right-1.5 bottom-3 size-5.5 rounded-full border-[3.5px] border-white bg-success" />
              )}
            </div>
          </div>
          <div className="absolute right-6 bottom-5 flex gap-2.5">
            <span className="rounded-full bg-white/94 px-4 py-2 text-[13px] font-bold text-primary-deep">
              <Camera className="mr-1.5 inline size-3.5" /> {profile.photoCount} photos
            </span>
            <span className="rounded-full bg-white/94 px-4 py-2 text-[13px] font-bold text-primary-deep">
              <PlayCircle className="mr-1.5 inline size-3.5" /> Video profile
            </span>
          </div>
        </div>

        <div className="flex min-h-24 items-start justify-between pt-5 pl-56">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[30px] font-extrabold tracking-[-0.02em] whitespace-nowrap text-primary-deep">
                {profile.name}, {profile.age}
              </span>
              {profile.verified && <Badge tone="primary">✓ Verified</Badge>}
              {profile.premium && <Badge tone="gold">★ Premium</Badge>}
              {profile.online && <Badge tone="success">● Online now</Badge>}
            </div>
            <div className="mt-2 text-[15px] text-muted-foreground">
              {profile.occupation} · {profile.place} · {profile.height} ·{" "}
              {profile.maritalStatus} · {profile.memberId}
            </div>
            <div className="mt-1 text-[13.5px] text-faint">
              {profile.managedByParent && "Profile managed by parent · "}Last active{" "}
              {profile.lastActive}
            </div>
          </div>
          <div className="flex items-center gap-2.5 pt-1.5">
            <Button size="cta">
              <Heart className="size-4" /> Express Interest
            </Button>
            <Button variant="gold" size="cta">
              <Phone className="size-4" /> View Contact
            </Button>
            <Button variant="outline" size="icon-cta" aria-label="Shortlist">
              <Star className="size-4.5" />
            </Button>
            <Button variant="outline" size="icon-cta" aria-label="Share">
              <Share2 className="size-4.5" />
            </Button>
            <Button variant="outline" size="icon-cta" aria-label="More">
              <MoreHorizontal className="size-4.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE HERO */}
      <div className="lg:hidden">
        <div className="relative">
          <ImageSlot label="Profile photo — portrait" className="h-105 w-full" />
          <div className="absolute inset-x-0 top-0 flex justify-between p-4">
            <button className="flex size-10.5 items-center justify-center rounded-xl bg-white/92 text-primary-deep">
              <ArrowLeft className="size-4" />
            </button>
            <div className="flex gap-2">
              <button className="flex size-10.5 items-center justify-center rounded-xl bg-white/92 text-primary-deep">
                <Share2 className="size-4" />
              </button>
              <button className="flex size-10.5 items-center justify-center rounded-xl bg-white/92 text-primary-deep">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </div>
          <div className="absolute bottom-4 left-5 flex gap-2">
            <span className="rounded-full bg-white/94 px-3.5 py-1.5 text-xs font-bold text-primary-deep">
              <Camera className="mr-1 inline size-3" /> {profile.photoCount}
            </span>
            <span className="rounded-full bg-white/94 px-3.5 py-1.5 text-xs font-bold text-primary-deep">
              <PlayCircle className="mr-1 inline size-3" /> Video
            </span>
          </div>
          <span className="absolute right-5 bottom-4 rounded-full bg-primary-deep px-3.5 py-2 text-xs font-extrabold text-white">
            {profile.matchPercent}% match
          </span>
        </div>

        <div className="relative z-[3] -mt-6 rounded-t-3xl bg-card px-5 pt-5.5 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[23px] font-extrabold tracking-[-0.02em] whitespace-nowrap text-primary-deep">
              {profile.name}, {profile.age}
            </span>
            {profile.verified && <Badge tone="primary" small>✓ Verified</Badge>}
            {profile.premium && <Badge tone="gold" small>★ Premium</Badge>}
          </div>
          <div className="mt-1.5 text-[13.5px] text-muted-foreground">
            {profile.occupation} · {profile.place.split(",")[0]} · {profile.height} ·{" "}
            {profile.maritalStatus}
          </div>
          {profile.online && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-success">
              <span className="size-1.5 rounded-full bg-success" /> Online now
              {profile.managedByParent && " · Managed by parent"}
            </div>
          )}

          <div className="mt-4 grid grid-cols-3 gap-2">
            <MobileStat value={profile.porutham} label="Porutham" tint="bg-surface-cream-2 text-gold-text" />
            <MobileStat value={`${profile.lifestyleMatch}%`} label="Lifestyle" tint="bg-success-bg text-success" />
            <MobileStat value={String(profile.trustScore)} label="Trust" tint="bg-surface-blue text-primary" />
          </div>
        </div>
      </div>
    </>
  );
}

function Badge({
  tone,
  small,
  children,
}: {
  tone: "primary" | "gold" | "success";
  small?: boolean;
  children: React.ReactNode;
}) {
  const tones = {
    primary: "bg-primary text-white",
    gold: "bg-gold-gradient text-white",
    success: "bg-success-bg text-success",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-extrabold whitespace-nowrap ${tones[tone]} ${
        small ? "px-2.5 py-1 text-[10.5px]" : "px-3.5 py-1.5 text-xs"
      }`}
    >
      {children}
    </span>
  );
}

function MobileStat({ value, label, tint }: { value: string; label: string; tint: string }) {
  return (
    <div className={`rounded-xl px-1 py-2.5 text-center ${tint}`}>
      <div className="text-[15px] font-extrabold">{value}</div>
      <div className="text-[9.5px] font-bold">{label.toUpperCase()}</div>
    </div>
  );
}
