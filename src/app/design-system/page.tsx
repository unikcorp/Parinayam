"use client";

import { useState } from "react";
import {
  Heart,
  Eye,
  Users,
  Bookmark,
  Search,
  Compass,
  MessageCircle,
  Bell,
  User,
} from "lucide-react";

import { brand } from "@/data/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  VerifiedBadge,
  PremiumBadge,
  EliteBadge,
  OnlineBadge,
  RecentlyActiveBadge,
  NewMemberBadge,
  TrustBadge,
  MatchBadge,
} from "@/components/profile/badges";
import { ProfileCard } from "@/components/profile/profile-card";
import { StatTile } from "@/components/shared/stat-tile";
import { ProgressRing } from "@/components/shared/progress-ring";
import { ProgressBar } from "@/components/shared/progress-bar";
import { ChatBubble, TypingDots } from "@/components/shared/chat-bubble";
import { VoiceWave } from "@/components/shared/voice-wave";
import { NotificationItem } from "@/components/shared/notification-item";
import { MembershipCard } from "@/components/shared/membership-card";
import { PlanCard } from "@/components/shared/plan-card";
import { FilterChip } from "@/components/shared/filter-chip";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { RangeFilter } from "@/components/shared/range-filter";
import { BottomNav } from "@/components/shared/bottom-nav";

const colorTokens = [
  { name: "Primary — Deep Red", hex: "#B91C1C", token: "primary" },
  { name: "Primary Hover", hex: "#DC2626", token: "primary-hover" },
  { name: "Primary Deep", hex: "#7F1D1D", token: "primary-deep" },
  { name: "Primary Darkest", hex: "#450A0A", token: "primary-darkest" },
  { name: "Gold", hex: "#E07A1F", token: "gold" },
  { name: "Success — Emerald", hex: "#0E9F6E", token: "success" },
];

const tintTokens = [
  { name: "Surface", hex: "#F7F8FA" },
  { name: "Surface red", hex: "#FCE8E8" },
  { name: "Surface cream", hex: "#FDF9F4" },
  { name: "Peach tint", hex: "#FBEFE6" },
  { name: "Success tint", hex: "#E6F6EF" },
  { name: "Border", hex: "#EEF0F4" },
];

export default function DesignSystemPage() {
  const [segment, setSegment] = useState<"matches" | "visitors" | "shortlisted">(
    "matches"
  );
  const [age, setAge] = useState<[number, number]>([24, 30]);
  const [chips, setChips] = useState([
    { label: "Age 24–30", active: true },
    { label: "Ernakulam", active: true },
    { label: "Never married", active: false },
    { label: "Postgraduate", active: false },
  ]);
  const [page, setPage] = useState(1);
  const [shortlisted, setShortlisted] = useState(false);
  const [navTab, setNavTab] = useState("dashboard");
  const [otp, setOtp] = useState("47");

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-14 sm:px-10 lg:px-18">
      <header className="mb-14 flex items-center gap-3">
        <div className="bg-dark-panel-gradient flex size-10 items-center justify-center rounded-xl text-lg font-extrabold text-gold-light">
          {brand.logoLetter}
        </div>
        <div>
          <div className="text-xl font-extrabold text-primary">
            {brand.name} Design System
          </div>
          <p className="text-sm text-muted-foreground">
            White-label token set — swap primary, gold and community strings to rebrand.
          </p>
        </div>
      </header>

      {/* COLORS */}
      <Section title="Color tokens">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {colorTokens.map((c) => (
            <div
              key={c.token}
              className="overflow-hidden rounded-2xl border border-card-border bg-card"
            >
              <div className="h-18" style={{ background: c.hex }} />
              <div className="p-3.5">
                <div className="text-[13px] font-bold text-primary-deep">
                  {c.name}
                </div>
                <div className="font-mono text-xs text-faint">{c.hex}</div>
                <div className="mt-0.5 text-[11px] text-faint">{c.token}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {tintTokens.map((c) => (
            <div
              key={c.name}
              className="overflow-hidden rounded-2xl border border-card-border bg-card"
            >
              <div className="h-12 border-b border-card-border" style={{ background: c.hex }} />
              <div className="p-3">
                <div className="text-[12.5px] font-bold text-primary-deep">
                  {c.name}
                </div>
                <div className="font-mono text-[11.5px] text-faint">{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* TYPOGRAPHY */}
      <Section title="Typography — Plus Jakarta Sans">
        <Panel className="flex flex-col gap-5">
          <div className="text-[60px] leading-[1.08] font-extrabold tracking-[-0.025em] text-primary-deep">
            Display / 60 · 800
          </div>
          <div className="text-4xl font-extrabold tracking-[-0.02em] text-primary-deep">
            Heading 1 / 40 · 800
          </div>
          <div className="text-[26px] font-bold text-primary-deep">
            Heading 2 / 26 · 700
          </div>
          <div className="text-[19px] font-bold text-primary-deep">
            Heading 3 / 19 · 700
          </div>
          <div className="max-w-xl text-base leading-[1.65] text-muted-foreground">
            Body / 16 · 400 — Readable body text with generous 1.65 line height
            for all age groups.
          </div>
          <div className="text-[13px] font-bold tracking-[0.08em] text-faint uppercase">
            Overline / 13 · 700 · Uppercase · +8% tracking
          </div>
        </Panel>
      </Section>

      {/* BUTTONS */}
      <Section title="Buttons">
        <Panel className="flex flex-wrap items-center gap-4">
          <Button size="cta">Primary</Button>
          <Button variant="gold" size="cta">
            Gold CTA
          </Button>
          <Button variant="outline" size="cta">
            Secondary
          </Button>
          <Button variant="secondary" size="cta">
            Tonal
          </Button>
          <Button variant="ghost" size="cta">
            Ghost
          </Button>
          <Button variant="destructive" size="cta">
            Destructive
          </Button>
          <Button size="cta" disabled>
            Disabled
          </Button>
          <Button variant="outline" size="icon-cta" aria-label="Shortlist">
            <Bookmark className="size-4.5" />
          </Button>
        </Panel>
      </Section>

      {/* BADGES */}
      <Section title="Badges & status indicators">
        <Panel className="flex flex-wrap items-center gap-3.5">
          <VerifiedBadge />
          <PremiumBadge />
          <EliteBadge />
          <OnlineBadge />
          <RecentlyActiveBadge />
          <NewMemberBadge />
          <TrustBadge score={94} />
          <MatchBadge percent={92} />
        </Panel>
      </Section>

      {/* INPUTS */}
      <Section title="Inputs, chips & OTP">
        <Panel className="flex flex-col gap-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Field label="Text field">
              <Input value="Anjali Menon" readOnly onChange={() => {}} />
            </Field>
            <Field label="Focused" tone="primary">
              <Input value="anjali@ex" className="border-primary ring-4 ring-surface-blue" readOnly onChange={() => {}} />
            </Field>
            <Field label="Error" tone="danger">
              <Input value="98470" aria-invalid readOnly onChange={() => {}} />
              <div className="mt-1.5 text-xs text-danger">
                Enter a valid 10-digit number
              </div>
            </Field>
          </div>
          <div>
            <label className="mb-2.5 block text-xs font-bold tracking-wide text-faint uppercase">
              OTP input
            </label>
            <InputOTP maxLength={4} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-2.5">
                {[0, 1, 2, 3].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="size-13 rounded-xl! border-input text-xl font-extrabold text-primary-deep data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-surface-blue"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div>
            <label className="mb-2.5 block text-xs font-bold tracking-wide text-faint uppercase">
              Filter chips
            </label>
            <div className="flex flex-wrap gap-2.5">
              {chips.map((chip, i) => (
                <FilterChip
                  key={chip.label}
                  active={chip.active}
                  onRemove={() =>
                    setChips((c) =>
                      c.map((x, xi) => (xi === i ? { ...x, active: false } : x))
                    )
                  }
                  onClick={() =>
                    setChips((c) =>
                      c.map((x, xi) => (xi === i ? { ...x, active: !x.active } : x))
                    )
                  }
                >
                  {chip.label}
                </FilterChip>
              ))}
            </div>
          </div>
          <RangeFilter label="Age" value={age} onChange={setAge} min={18} max={60} />
        </Panel>
      </Section>

      {/* CARDS ROW */}
      <Section title="Profile card · Notifications · Chat · Membership">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[300px_1fr_1fr_300px]">
          <ProfileCard
            name="Anjali M"
            age={27}
            occupation="Software Engineer"
            location="Kochi"
            premium
            verified
            shortlisted={shortlisted}
            onShortlist={() => setShortlisted((s) => !s)}
          />

          <div className="flex flex-col gap-3">
            <NotificationItem
              icon={Heart}
              tint="peach"
              title={
                <>
                  <b>Devika K</b> sent you an interest
                </>
              }
              time="2 min ago"
              unread
            />
            <NotificationItem
              icon={Users}
              tint="success"
              title={
                <>
                  <b>Arjun N</b> accepted your interest
                </>
              }
              time="1 hr ago"
            />
            <div className="bg-primary-deep flex items-center gap-3 rounded-2xl px-4.5 py-3.5 text-white shadow-toast">
              <span className="flex size-6.5 items-center justify-center rounded-full bg-success text-xs">
                ✓
              </span>
              <span className="text-sm font-semibold">
                Interest sent to Anjali M
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 rounded-3xl border border-card-border bg-card p-5">
            <ChatBubble from="other">
              Hello! Our families spoke yesterday 😊
            </ChatBubble>
            <ChatBubble from="self" time="10:42" read>
              Yes! Amma was very happy after the call.
            </ChatBubble>
            <TypingDots />
          </div>

          <MembershipCard
            planName="Premium"
            validTill="Mar 2027"
            memberName="Anjali Menon"
            memberId="PNM-2024-08412"
            contactViewsUsed={68}
            contactViewsTotal={100}
          />
        </div>
      </Section>

      {/* PROGRESS / SEGMENTED / PAGINATION / SKELETON */}
      <Section title="Progress · Segmented · Pagination · Skeleton">
        <Panel className="grid grid-cols-1 gap-9 lg:grid-cols-2">
          <div className="flex flex-col gap-7">
            <ProgressBar percent={85} variant="success" label="Profile completion" valueLabel="85%" />
            <SegmentedControl
              value={segment}
              onChange={setSegment}
              options={[
                { label: "Matches", value: "matches" },
                { label: "Visitors", value: "visitors" },
                { label: "Shortlisted", value: "shortlisted" },
              ]}
            />
            <Pagination page={page} totalPages={12} onPageChange={setPage} />
            <div className="flex items-center gap-3.5">
              <Skeleton className="bg-shimmer size-13 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="bg-shimmer h-3 w-3/5 rounded-full" />
                <Skeleton className="bg-shimmer h-3 w-2/5 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <ProgressRing percent={85} color="#0E9F6E" sublabel="Profile strength" />
            <div className="flex items-center gap-6">
              <ProgressRing percent={92} size={92} strokeWidth={8} />
              <div className="flex items-center gap-3">
                <Switch defaultChecked size="lg" />
                <span className="text-sm font-semibold text-ink">Visible to all members</span>
              </div>
            </div>
          </div>
        </Panel>
      </Section>

      {/* ACCORDION + EMPTY STATE */}
      <Section title="Accordion · Empty state">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel>
            <Accordion defaultValue={["item-2"]}>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-[15px] font-bold text-primary-deep">
                  What is horoscope matching?
                </AccordionTrigger>
                <AccordionContent className="text-[14px] leading-[1.65] text-muted-foreground">
                  We compare porutham factors between two horoscopes and surface a
                  compatibility summary on the profile page.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-[15px] font-bold text-primary">
                  How does verification work?
                </AccordionTrigger>
                <AccordionContent className="text-[14px] leading-[1.65] text-muted-foreground">
                  We check a government ID, confirm your phone via OTP, and match a
                  live selfie against your profile photo. Verified members get the
                  red badge.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-[15px] font-bold text-primary-deep">
                  Can parents manage a profile?
                </AccordionTrigger>
                <AccordionContent className="text-[14px] leading-[1.65] text-muted-foreground">
                  Yes — a parent or sibling can create and manage a profile on
                  behalf of the member.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Panel>
          <EmptyState
            icon={Search}
            title="No matches yet"
            description="Try widening your age or district filters"
            actionLabel="Adjust filters"
          />
        </div>
      </Section>

      {/* PLAN CARDS */}
      <Section title="Membership plans">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <PlanCard
            name="Basic"
            price="Free"
            period=""
            features={["Create a profile", "5 interests / month", "Limited search"]}
          />
          <PlanCard
            name="Premium"
            price="₹1,499"
            badge="Most popular"
            highlighted
            features={[
              "Unlimited interests",
              "View contact details",
              "Priority in search results",
              "Voice intro & AI match score",
            ]}
          />
          <PlanCard
            name="Elite"
            price="₹3,499"
            dark
            features={[
              "Everything in Premium",
              "Dedicated relationship manager",
              "Profile highlighted to matches",
            ]}
          />
        </div>
      </Section>

      {/* MODAL / SHEET */}
      <Section title="Modal · Bottom sheet">
        <div className="flex flex-wrap gap-4">
          <Dialog>
            <DialogTrigger render={<Button size="cta" />}>
              Express interest
            </DialogTrigger>
            <DialogContent className="max-w-90 rounded-3xl p-7 text-center">
              <span className="mx-auto mb-3.5 flex size-14 items-center justify-center rounded-full bg-peach-bg text-2xl text-peach-text">
                ♥
              </span>
              <div className="text-lg font-extrabold text-primary-deep">
                Express interest?
              </div>
              <div className="mt-2 mb-5 text-sm leading-[1.6] text-muted-foreground">
                Anjali M will be notified. You have 4 free interests left this
                month.
              </div>
              <div className="flex gap-2.5">
                <DialogClose render={<Button variant="outline" className="flex-1" />}>
                  Cancel
                </DialogClose>
                <DialogClose render={<Button className="flex-1" />}>
                  Send interest
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="cta" />}>
              Sort results
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl p-6">
              <div className="mx-auto mb-4.5 h-1 w-10 rounded-full bg-input" />
              <div className="mb-3.5 text-base font-extrabold text-primary-deep">
                Sort results
              </div>
              <div className="flex flex-col gap-1.5 text-[14.5px]">
                <div className="flex justify-between rounded-xl bg-surface-blue px-3.5 py-3 font-bold text-primary">
                  Best match <span>✓</span>
                </div>
                <div className="rounded-xl px-3.5 py-3 font-semibold text-muted-foreground">
                  Newest first
                </div>
                <div className="rounded-xl px-3.5 py-3 font-semibold text-muted-foreground">
                  Recently active
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Section>

      {/* VOICE WAVE + BOTTOM NAV PREVIEW */}
      <Section title="Voice message · Bottom nav (mobile)">
        <Panel className="flex flex-col gap-6">
          <div className="flex max-w-md flex-col gap-3">
            <VoiceWave variant="other" duration="0:24" />
            <VoiceWave variant="self" duration="0:12" />
          </div>
          <div className="relative h-20 w-full max-w-sm self-center overflow-hidden rounded-2xl border border-card-border">
            <BottomNav
              className="absolute inset-x-0 bottom-0"
              active={navTab}
              onChange={setNavTab}
              items={[
                { key: "dashboard", label: "Home", icon: Compass },
                { key: "search", label: "Search", icon: Search },
                { key: "inbox", label: "Chat", icon: MessageCircle },
                { key: "profile", label: "Profile", icon: User },
              ]}
            />
          </div>
        </Panel>
      </Section>

      <Section title="Stat tiles">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          <StatTile icon={Heart} label="Interests received" value={12} tint="peach" />
          <StatTile icon={Eye} label="Profile visitors" value={34} tint="blue" />
          <StatTile icon={Bookmark} label="Shortlisted" value={8} tint="gold" />
          <StatTile icon={Bell} label="Notifications" value={5} tint="success" />
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      <h2 className="mb-5 text-xl font-extrabold text-primary-deep">{title}</h2>
      {children}
    </section>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-card-border bg-card p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  tone = "default",
  children,
}: {
  label: string;
  tone?: "default" | "primary" | "danger";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "primary"
      ? "text-primary"
      : tone === "danger"
        ? "text-danger"
        : "text-faint";
  return (
    <div>
      <label className={`mb-2 block text-xs font-bold tracking-wide uppercase ${toneClass}`}>
        {label}
      </label>
      {children}
    </div>
  );
}
