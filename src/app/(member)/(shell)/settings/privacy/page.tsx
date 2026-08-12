"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useMyProfile, useUpdatePrivacyPreferences } from "@/hooks/use-my-profile";

export default function PrivacySettingsPage() {
  const { data, isLoading, isError } = useMyProfile();
  const updatePrivacy = useUpdatePrivacyPreferences();
  const [showInSearch, setShowInSearch] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    setShowInSearch(!!data.member.show_in_search);
    setShowOnlineStatus(!!data.member.show_online_status);
  }, [data]);

  function save(next: { showInSearch: boolean; showOnlineStatus: boolean }) {
    setSavedMessage(null);
    updatePrivacy.mutate(next, {
      onSuccess: () => {
        setSavedMessage("Saved");
        setTimeout(() => setSavedMessage(null), 2000);
      },
    });
  }

  if (isLoading) {
    return <div className="py-16 text-center text-sm text-faint">Loading…</div>;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-sm font-semibold text-destructive">Unable to load your privacy settings.</p>
        <p className="text-sm text-faint">Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5.5">
      <div className="flex items-center justify-between">
        <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep">Privacy & Visibility</h1>
        {savedMessage && <span className="text-xs font-bold text-success">{savedMessage}</span>}
      </div>

      <section className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-7">
        <div className="flex items-center justify-between border-b border-[#F5F6F9] py-3.5 first:pt-0">
          <div>
            <div className="text-[14.5px] font-bold text-ink">Show my profile in search</div>
            <div className="mt-0.5 text-[12.5px] text-faint">Verified members can find you in search results</div>
          </div>
          <Switch
            size="lg"
            checked={showInSearch}
            onCheckedChange={(v) => {
              setShowInSearch(v);
              save({ showInSearch: v, showOnlineStatus });
            }}
          />
        </div>
        <div className="flex items-center justify-between py-3.5 last:pb-0">
          <div>
            <div className="text-[14.5px] font-bold text-ink">Show online status</div>
            <div className="mt-0.5 text-[12.5px] text-faint">Members can see when you're active</div>
          </div>
          <Switch
            size="lg"
            checked={showOnlineStatus}
            onCheckedChange={(v) => {
              setShowOnlineStatus(v);
              save({ showInSearch, showOnlineStatus: v });
            }}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-card-border bg-card p-5 lg:rounded-[20px] lg:p-7">
        <div className="text-[14.5px] font-bold text-ink">Photo privacy</div>
        <p className="mt-1 text-[13px] text-faint">
          Tiered photo access (everyone / on request / premium only) isn't available yet — coming soon.
        </p>
      </section>
    </div>
  );
}
