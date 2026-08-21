"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMyProfile, useUpdatePrivacyPreferences, type ContentVisibility } from "@/hooks/use-my-profile";
import { SectionSkeleton } from "@/components/shared/loading-skeletons";

const VISIBILITY_OPTIONS: { value: ContentVisibility; label: string }[] = [
  { value: "ALL_MEMBERS", label: "All Members" },
  { value: "PREMIUM_MEMBERS", label: "All Premium Members" },
  { value: "INTEREST_ACCEPTED", label: "Only Interest Accepted Members" },
];

// base-ui's <Select.Value> shows the raw value string unless told how to
// map it to a label — every other Select in this app just happens to have
// value === label (e.g. "Hindu"), so this was never needed until now.
function visibilityLabel(value: ContentVisibility): string {
  return VISIBILITY_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export default function PrivacySettingsPage() {
  const { data, isLoading, isError } = useMyProfile();
  const updatePrivacy = useUpdatePrivacyPreferences();
  const [showInSearch, setShowInSearch] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [photoVisibility, setPhotoVisibility] = useState<ContentVisibility>("ALL_MEMBERS");
  const [phoneVisibility, setPhoneVisibility] = useState<ContentVisibility>("ALL_MEMBERS");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    setShowInSearch(!!data.member.show_in_search);
    setShowOnlineStatus(!!data.member.show_online_status);
    setPhotoVisibility(data.member.photo_visibility);
    setPhoneVisibility(data.member.phone_visibility);
  }, [data]);

  function save(next: {
    showInSearch: boolean;
    showOnlineStatus: boolean;
    photoVisibility: ContentVisibility;
    phoneVisibility: ContentVisibility;
  }) {
    setSavedMessage(null);
    updatePrivacy.mutate(next, {
      onSuccess: () => {
        setSavedMessage("Saved");
        setTimeout(() => setSavedMessage(null), 2000);
      },
    });
  }

  if (isLoading) {
    return <SectionSkeleton />;
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
              save({ showInSearch: v, showOnlineStatus, photoVisibility, phoneVisibility });
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
              save({ showInSearch, showOnlineStatus: v, photoVisibility, phoneVisibility });
            }}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-7">
        <div className="flex items-center justify-between border-b border-[#F5F6F9] py-3.5 first:pt-0">
          <div>
            <div className="text-[14.5px] font-bold text-ink">Who can see my photos</div>
            <div className="mt-0.5 text-[12.5px] text-faint">Applies to your profile photo and gallery, once admin-approved</div>
          </div>
          <Select
            value={photoVisibility}
            onValueChange={(v) => {
              if (!v) return;
              const next = v as ContentVisibility;
              setPhotoVisibility(next);
              save({ showInSearch, showOnlineStatus, photoVisibility: next, phoneVisibility });
            }}
          >
            <SelectTrigger className="w-56">
              <SelectValue>{(v: ContentVisibility) => visibilityLabel(v)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between py-3.5 last:pb-0">
          <div>
            <div className="text-[14.5px] font-bold text-ink">Who can see my phone number</div>
            <div className="mt-0.5 text-[12.5px] text-faint">Controls who can reveal your contact number</div>
          </div>
          <Select
            value={phoneVisibility}
            onValueChange={(v) => {
              if (!v) return;
              const next = v as ContentVisibility;
              setPhoneVisibility(next);
              save({ showInSearch, showOnlineStatus, photoVisibility, phoneVisibility: next });
            }}
          >
            <SelectTrigger className="w-56">
              <SelectValue>{(v: ContentVisibility) => visibilityLabel(v)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>
    </div>
  );
}
