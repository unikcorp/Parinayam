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
import { AppMobileHeader } from "@/components/layout/app-mobile-header";
import { StatTile } from "@/components/shared/stat-tile";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProgressRing } from "@/components/shared/progress-ring";
import { ProgressBar } from "@/components/shared/progress-bar";
import { NotificationItem } from "@/components/shared/notification-item";
import { ImageSlot } from "@/components/shared/image-slot";
import { Button } from "@/components/ui/button";

const tiles = [
  { icon: Heart, tint: "peach" as const, value: 14, label: "Interests received" },
  { icon: ArrowUpRight, tint: "blue" as const, value: 9, label: "Interests sent" },
  { icon: Eye, tint: "gold" as const, value: 38, label: "Profile visitors" },
  { icon: Star, tint: "success" as const, value: 12, label: "Shortlisted you" },
];

const matches = [
  { name: "Arjun N", age: 29, occupation: "Chartered Accountant", place: "Thrissur", match: 92, online: true },
  { name: "Kiran P", age: 31, occupation: "Civil Engineer", place: "Kozhikode", match: 89, online: false },
  { name: "Sreejith M", age: 30, occupation: "Bank Manager", place: "Kottayam", match: 87, online: true },
];

const recentlyViewed = [
  { name: "Vishnu P, 30", place: "Trivandrum" },
  { name: "Hari K, 28", place: "Palakkad" },
  { name: "Ananthu R, 32", place: "Kannur" },
  { name: "Rahul N, 29", place: "Kochi" },
  { name: "Deepak M, 31", place: "Thrissur" },
];

const notifications = [
  { icon: Heart, tint: "peach" as const, text: <><b>Arjun N</b> sent you an interest</>, when: "12 min ago", unread: true },
  { icon: Eye, tint: "blue" as const, text: <><b>Kiran P</b> viewed your profile</>, when: "1 hr ago", unread: true },
  { icon: Check, tint: "success" as const, text: <><b>Sreejith M</b> accepted your interest</>, when: "Yesterday", unread: false },
  { icon: Star, tint: "gold" as const, text: "Your membership renews in 30 days", when: "2 days ago", unread: false },
];

const quickActions = [
  { icon: Pencil, label: "Edit profile", tint: "bg-surface-blue text-primary" },
  { icon: Camera, label: "Add photos", tint: "bg-peach-bg text-peach-text" },
  { icon: Star, label: "Horoscope", tint: "bg-surface-cream-2 text-gold-text" },
  { icon: Settings, label: "Preferences", tint: "bg-success-bg text-success" },
];

export default function DashboardPage() {
  return (
    <>
      <AppMobileHeader greeting="Good morning 🌤" name="Anjali Menon" />

      <div className="grid grid-cols-1 gap-6 px-5 py-5 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-7 lg:px-12 lg:py-8">
        {/* MAIN COLUMN */}
        <div className="flex flex-col gap-6 lg:gap-7">
          {/* welcome banner (desktop) */}
          <div className="bg-dark-panel-gradient hidden items-center justify-between rounded-[22px] px-8.5 py-7.5 text-white lg:flex">
            <div>
              <div className="text-2xl font-extrabold tracking-[-0.01em]">
                Good morning, Anjali 🌤
              </div>
              <div className="mt-1.5 text-[14.5px] text-white/70">
                You have <b className="text-gold-light">3 new interests</b> and{" "}
                <b className="text-gold-light">12 new matches</b> today.
              </div>
            </div>
            <Button variant="outline" className="border-white/20 bg-white/12 text-white hover:bg-white/20">
              View today&apos;s matches →
            </Button>
          </div>

          {/* welcome banner (mobile) */}
          <div className="bg-dark-panel-gradient rounded-2xl p-5 text-white lg:hidden">
            <div className="text-[15px] font-bold">3 new interests · 12 new matches</div>
            <div className="mt-1 mb-3.5 text-xs text-white/70">
              Your profile is getting noticed today.
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
            {tiles.map((t) => (
              <StatTile key={t.label} {...t} className="p-3 text-center lg:p-5 lg:text-left" />
            ))}
          </div>

          {/* profile strength (mobile only, inline card) */}
          <Link
            href="/settings"
            className="flex items-center gap-4 rounded-2xl border border-card-border bg-card p-4.5 lg:hidden"
          >
            <ProgressRing percent={85} size={62} strokeWidth={7} color="#0E9F6E" label="85%" />
            <div className="flex-1">
              <div className="text-[15px] font-extrabold text-primary-deep">
                Profile strength: Strong
              </div>
              <div className="mt-0.5 text-xs text-faint">Add a voice intro for +10%</div>
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
            <div className="pn-scroll-x -mx-5 flex gap-3 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4.5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
              {matches.map((m) => (
                <ProfileCard
                  key={m.name}
                  name={m.name}
                  age={m.age}
                  occupation={m.occupation}
                  location={m.place}
                  matchPercent={m.match}
                  online={m.online}
                  verified
                  className="w-50 shrink-0 lg:w-auto"
                  photoClassName="h-45 lg:h-52.5"
                />
              ))}
            </div>
          </section>

          {/* recently viewed */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-primary-deep lg:text-xl">
                Recently viewed by you
              </h2>
              <Link href="#" className="text-sm font-bold text-primary">
                See all →
              </Link>
            </div>
            <div className="pn-scroll-x -mx-5 flex gap-3 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
              {recentlyViewed.map((r) => (
                <div
                  key={r.name}
                  className="w-24.5 shrink-0 rounded-2xl border border-card-border bg-card p-3.5 text-center lg:w-auto lg:p-4"
                >
                  <ImageSlot label="photo" className="mx-auto mb-2.5 size-17 rounded-full" />
                  <div className="truncate text-[13.5px] font-bold text-primary-deep">
                    {r.name}
                  </div>
                  <div className="mt-0.5 truncate text-[11.5px] text-faint">{r.place}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR (desktop only) */}
        <aside className="hidden flex-col gap-5 lg:flex">
          <div className="rounded-[20px] border border-card-border bg-card p-6">
            <div className="mb-4.5 flex items-center gap-4">
              <ProgressRing percent={85} size={74} strokeWidth={8} color="#0E9F6E" label="85%" />
              <div>
                <div className="text-base font-extrabold text-primary-deep">
                  Profile strength
                </div>
                <div className="mt-0.5 text-[13px] text-faint">Strong — almost there!</div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 text-[13.5px] text-muted-foreground">
                <Check className="size-4 text-success" /> Photos added
              </div>
              <div className="flex items-center gap-2.5 text-[13.5px] text-muted-foreground">
                <Check className="size-4 text-success" /> ID verified
              </div>
              <div className="flex items-center justify-between rounded-[11px] bg-peach-bg px-3.5 py-2.5 text-[13.5px] font-bold text-primary-deep">
                <span>＋ Add voice introduction</span>
                <span className="text-peach-text">+10%</span>
              </div>
              <div className="flex items-center justify-between rounded-[11px] bg-surface-cream-2 px-3.5 py-2.5 text-[13.5px] font-bold text-primary-deep">
                <span>＋ Add horoscope details</span>
                <span className="text-gold-text">+5%</span>
              </div>
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
            <div className="mb-4 flex items-center justify-between">
              <div className="text-base font-extrabold text-primary-deep">Notifications</div>
              <Link href="/notifications" className="text-[13px] font-bold text-primary">
                All →
              </Link>
            </div>
            <div className="flex flex-col">
              {notifications.map((n, i) => (
                <div key={i} className="border-t border-[#F3F5F9] py-3 first:border-t-0 first:pt-0">
                  <NotificationItem
                    icon={n.icon}
                    tint={n.tint}
                    title={n.text}
                    time={n.when}
                    unread={n.unread}
                    className="border-0 p-0"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-card-border bg-card p-5.5">
            <div className="mb-3.5 text-base font-extrabold text-primary-deep">
              Quick actions
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  className={`rounded-xl px-2 py-3.5 text-center text-[12.5px] font-bold ${a.tint}`}
                >
                  <a.icon className="mx-auto mb-1.5 size-4" />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
