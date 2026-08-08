"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Pause, KeyRound, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/shared/image-slot";
import { cn } from "@/lib/utils";
import {
  settingsNavItems,
  visibilityToggles,
  notificationMatrix,
  blockedUsers,
  mobileAccountItems,
} from "@/data/settings.data";

const photoPrivacyOptions = [
  { key: "all", icon: "🌐", label: "All members", desc: "Any verified member" },
  { key: "request", icon: "🤝", label: "On request", desc: "Only members you approve" },
  { key: "premium", icon: "🔒", label: "Premium only", desc: "Paid members only" },
] as const;

export default function SettingsPage() {
  const [photoPrivacy, setPhotoPrivacy] = useState<(typeof photoPrivacyOptions)[number]["key"]>(
    "request"
  );
  const [toggles, setToggles] = useState(
    Object.fromEntries(visibilityToggles.map((t) => [t.key, t.defaultOn]))
  );
  const [blocked, setBlocked] = useState(blockedUsers);

  return (
    <div className="lg:mx-auto lg:grid lg:max-w-[1240px] lg:grid-cols-[300px_1fr] lg:items-start lg:gap-7 lg:px-12 lg:py-8">
      {/* MOBILE HEADER */}
      <header className="flex items-center gap-3 border-b border-card-border bg-card px-5 py-4 lg:hidden">
        <Link
          href="/dashboard"
          className="flex size-9.5 items-center justify-center rounded-[10px] bg-muted text-primary-deep"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div className="text-lg font-extrabold text-primary-deep">Settings</div>
      </header>

      {/* DESKTOP SIDE NAV */}
      <aside className="sticky top-6 hidden flex-col gap-1 rounded-[20px] border border-card-border bg-card p-4 lg:flex">
        {settingsNavItems.map((item) => (
          <div
            key={item.label}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3.5 text-[14.5px]",
              item.label === "Privacy & visibility"
                ? "bg-surface-blue font-bold text-primary"
                : "font-semibold text-muted-foreground"
            )}
          >
            <span className="text-base">{item.icon}</span> {item.label}
          </div>
        ))}
      </aside>

      {/* MOBILE CONTENT */}
      <main className="flex flex-col gap-5 px-5 py-5 lg:hidden">
        <div className="flex items-center gap-3.5 rounded-2xl border border-card-border bg-card p-4">
          <ImageSlot label="you" className="size-13.5 rounded-full border-2 border-gold-light" />
          <div className="flex-1">
            <div className="text-base font-extrabold text-primary-deep">Anjali Menon</div>
            <div className="mt-0.5 text-xs text-faint">PNM-2024-08412 · ★ Premium</div>
          </div>
          <ChevronRight className="size-4 text-faint" />
        </div>

        <div>
          <div className="mb-2.5 pl-1 text-xs font-extrabold tracking-wide text-faint uppercase">
            Privacy &amp; visibility
          </div>
          <div className="overflow-hidden rounded-2xl border border-card-border bg-card">
            <MobileRow icon="📷" label="Photo privacy" desc="Visible on request" chevron />
            {visibilityToggles.filter((t) => t.mobile).map((t) => (
              <MobileToggleRow
                key={t.key}
                icon={t.icon}
                label={t.mobileLabel}
                desc={t.desc}
                checked={toggles[t.key]}
                onChange={(v) => setToggles((s) => ({ ...s, [t.key]: v }))}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2.5 pl-1 text-xs font-extrabold tracking-wide text-faint uppercase">
            Account
          </div>
          <div className="overflow-hidden rounded-2xl border border-card-border bg-card">
            {mobileAccountItems.map((it) => (
              <MobileRow key={it.label} icon={it.icon} label={it.label} badge={it.badge} chevron />
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#F5D9D6] bg-card">
          <MobileRow icon="⏸" label="Pause my profile" chevron />
          <MobileRow icon="🗑" label="Delete account" labelClassName="text-danger" chevron last />
        </div>

        <div className="mt-1.5 text-center text-xs text-faint/80">
          Parinayam v2.4.1 · Signed in as +91 98470 12345
        </div>
      </main>

      {/* DESKTOP CONTENT */}
      <div className="hidden flex-col gap-5.5 lg:flex">
        <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep">
          Privacy &amp; visibility
        </h1>

        {/* photo privacy */}
        <section className="rounded-[20px] border border-card-border bg-card p-7">
          <div className="mb-1.5 text-lg font-extrabold text-primary-deep">Photo privacy</div>
          <div className="mb-4.5 text-[13.5px] text-faint">Control who can see your photos.</div>
          <div className="grid grid-cols-3 gap-3">
            {photoPrivacyOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setPhotoPrivacy(opt.key)}
                className={cn(
                  "relative rounded-2xl border p-4 text-left",
                  photoPrivacy === opt.key
                    ? "border-2 border-primary bg-[#FBFCFE]"
                    : "border-input"
                )}
              >
                {photoPrivacy === opt.key && (
                  <span className="absolute top-3 right-3 flex size-4.5 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="size-2.5" />
                  </span>
                )}
                <div
                  className={cn(
                    "text-sm font-bold",
                    photoPrivacy === opt.key ? "text-primary" : "text-primary-deep"
                  )}
                >
                  {opt.icon} {opt.label}
                </div>
                <div className="mt-1 text-xs text-faint">{opt.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* visibility toggles */}
        <section className="rounded-[20px] border border-card-border bg-card p-7">
          <div className="mb-4.5 text-lg font-extrabold text-primary-deep">
            Visibility controls
          </div>
          <div className="flex flex-col">
            {visibilityToggles.map((t) => (
              <div
                key={t.key}
                className="flex items-center justify-between border-t border-[#F5F6F9] py-3.5 first:border-t-0 first:pt-0"
              >
                <div>
                  <div className="text-[14.5px] font-bold text-ink">{t.label}</div>
                  <div className="mt-0.5 text-[12.5px] text-faint">{t.desc}</div>
                </div>
                <Switch
                  size="lg"
                  checked={toggles[t.key]}
                  onCheckedChange={(v) => setToggles((s) => ({ ...s, [t.key]: v }))}
                />
              </div>
            ))}
          </div>
        </section>

        {/* notification matrix */}
        <section className="rounded-[20px] border border-card-border bg-card p-7">
          <div className="mb-4.5 text-lg font-extrabold text-primary-deep">
            Notification preferences
          </div>
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 border-b border-card-border pb-3 text-xs font-extrabold tracking-wide text-faint uppercase">
            <span>Event</span>
            <span className="text-center">Push</span>
            <span className="text-center">Email</span>
            <span className="text-center">SMS</span>
          </div>
          {notificationMatrix.map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-2 border-b border-[#F5F6F9] py-3.5 last:border-b-0"
            >
              <span className="text-sm font-semibold text-ink">{r.label}</span>
              <MatrixMark on={r.push} />
              <MatrixMark on={r.email} />
              <MatrixMark on={r.sms} />
            </div>
          ))}
        </section>

        {/* blocked users */}
        <section className="rounded-[20px] border border-card-border bg-card p-7">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-extrabold text-primary-deep">Blocked users</div>
            <span className="text-[12.5px] font-semibold text-faint">
              {blocked.length} blocked
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {blocked.map((b) => (
              <div key={b.id} className="flex items-center gap-3.5">
                <span className="flex size-10.5 items-center justify-center rounded-full bg-muted text-sm font-extrabold text-faint">
                  {b.initials}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-ink">{b.id}</div>
                  <div className="text-xs text-faint">{b.when}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBlocked((bs) => bs.filter((x) => x.id !== b.id))}
                >
                  Unblock
                </Button>
              </div>
            ))}
            {blocked.length === 0 && (
              <p className="text-sm text-faint">No blocked users.</p>
            )}
          </div>
        </section>

        {/* danger zone */}
        <section className="rounded-[20px] border border-[#F5D9D6] bg-card p-7">
          <div className="mb-1.5 text-lg font-extrabold text-danger">Account</div>
          <div className="mb-4.5 text-[13.5px] text-faint">
            Pausing hides your profile from search. Deleting is permanent after 30 days.
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Pause className="size-4" /> Pause profile
            </Button>
            <Button variant="outline">
              <KeyRound className="size-4" /> Change password
            </Button>
            <Button variant="destructive">
              <Trash2 className="size-4" /> Delete account
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function MatrixMark({ on }: { on: boolean }) {
  return (
    <span className={cn("text-center text-[15px] font-extrabold", on ? "text-success" : "text-input")}>
      {on ? "✓" : "—"}
    </span>
  );
}

function MobileRow({
  icon,
  label,
  desc,
  badge,
  chevron,
  last,
  labelClassName,
}: {
  icon: string;
  label: string;
  desc?: string;
  badge?: string;
  chevron?: boolean;
  last?: boolean;
  labelClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 border-b border-[#F5F6F9] px-4.5 py-4",
        last && "border-b-0"
      )}
    >
      <span className="text-base">{icon}</span>
      <div className="flex-1">
        <div className={cn("text-sm font-bold text-ink", labelClassName)}>{label}</div>
        {desc && <div className="mt-0.5 text-xs text-faint">{desc}</div>}
      </div>
      {badge && (
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
          {badge}
        </span>
      )}
      {chevron && <ChevronRight className="size-4 text-faint" />}
    </div>
  );
}

function MobileToggleRow({
  icon,
  label,
  desc,
  checked,
  onChange,
}: {
  icon: string;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3.5 border-b border-[#F5F6F9] px-4.5 py-4 last:border-b-0">
      <span className="text-base">{icon}</span>
      <div className="flex-1">
        <div className="text-sm font-bold text-ink">{label}</div>
        <div className="mt-0.5 text-xs text-faint">{desc}</div>
      </div>
      <Switch size="lg" checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
