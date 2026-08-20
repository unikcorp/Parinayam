"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";

type SectionKey =
  | "personal_location"
  | "education"
  | "family"
  | "horoscope"
  | "about"
  | "partner_preference"
  | "photos"
  | "identity";

interface CompletionSummary {
  profile_completion: number;
  sections: Record<SectionKey, boolean>;
  mandatory_done: boolean;
  has_selected_plan: boolean;
  can_enter_dashboard: boolean;
}

const MANDATORY_SECTIONS: SectionKey[] = ["personal_location", "education", "about"];
const ALL_SECTIONS: SectionKey[] = [
  "personal_location",
  "education",
  "family",
  "horoscope",
  "about",
  "partner_preference",
  "photos",
  "identity",
];
const SECTION_TO_EDIT_STEP: Record<SectionKey, string> = {
  personal_location: "personal",
  education: "education",
  family: "family",
  horoscope: "horoscope",
  about: "about",
  partner_preference: "preferences",
  photos: "photos",
  identity: "verification",
};

// Gates the member dashboard/search/messages/etc. (everything under the
// (shell) group) — a member needs overall completion at 60%+ AND an active
// membership plan selected (Free counts, but it must be chosen through the
// real checkout flow, not assumed). Fetches fresh on every mount rather
// than trusting the session snapshot from login, since either of those can
// change later (editing the profile, picking a plan) without logging out.
// Lives here rather than in the top-level (member) layout so /profile/edit,
// /plans and /checkout (siblings of (shell), not inside it) stay reachable
// — otherwise a gated member could never land on the pages meant to fix it.
export function RequireCompleteProfile({ children }: { children: React.ReactNode }) {
  const { isRestoring, isAuthenticated } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<CompletionSummary | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isRestoring || !isAuthenticated) return;
    let cancelled = false;

    api
      .get<CompletionSummary>("/api/members/me/completion")
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .finally(() => {
        if (!cancelled) setChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, [isRestoring, isAuthenticated]);

  useEffect(() => {
    if (!checked || !summary) return;

    if (summary.can_enter_dashboard) return;

    const profileReady = summary.profile_completion >= 60;
    if (!profileReady) {
      const firstIncomplete =
        MANDATORY_SECTIONS.find((key) => !summary.sections[key]) ??
        ALL_SECTIONS.find((key) => !summary.sections[key]) ??
        "personal_location";
      router.replace(`/profile/edit?step=${SECTION_TO_EDIT_STEP[firstIncomplete]}&resume=1`);
      return;
    }

    if (!summary.has_selected_plan) {
      router.replace("/plans");
    }
  }, [checked, summary, router]);

  const ready = checked && summary?.can_enter_dashboard;

  if (isRestoring || !checked || !ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-faint">
        <Loader2 className="size-4 animate-spin" /> Loading…
      </div>
    );
  }

  return <>{children}</>;
}
