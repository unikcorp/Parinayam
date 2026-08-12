"use client";

import { Switch } from "@/components/ui/switch";
import {
  useNotificationPreferences,
  useUpdateNotificationPreference,
  NOTIFICATION_CATEGORY_LABELS,
  type NotificationPreference,
} from "@/hooks/use-notification-preferences";

const channels = [
  { key: "push" as const, label: "Push" },
  { key: "email" as const, label: "Email" },
  { key: "sms" as const, label: "SMS" },
];

export default function NotificationsSettingsPage() {
  const { data, isLoading, isError } = useNotificationPreferences();
  const update = useUpdateNotificationPreference();

  function toggle(pref: NotificationPreference, channel: "push" | "email" | "sms", value: boolean) {
    update.mutate({ category: pref.category, push: pref.push, email: pref.email, sms: pref.sms, [channel]: value });
  }

  return (
    <div className="flex flex-col gap-5.5">
      <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep">Notifications</h1>

      {isLoading && <div className="py-16 text-center text-sm text-faint">Loading…</div>}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm font-semibold text-destructive">Unable to load your notification settings.</p>
          <p className="text-sm text-faint">Please try again.</p>
        </div>
      )}

      {data && (
        <section className="overflow-hidden rounded-2xl border border-card-border bg-card lg:rounded-[20px]">
          <div className="grid grid-cols-[1.6fr_repeat(3,0.7fr)] items-center gap-2 border-b border-[#F5F6F9] bg-surface px-4.5 py-3 lg:px-7">
            <span className="text-[11px] font-extrabold tracking-wide text-faint uppercase">Notification</span>
            {channels.map((c) => (
              <span key={c.key} className="text-center text-[11px] font-extrabold text-faint uppercase">
                {c.label}
              </span>
            ))}
          </div>
          {data.map((pref, i) => (
            <div
              key={pref.category}
              className={`grid grid-cols-[1.6fr_repeat(3,0.7fr)] items-center gap-2 px-4.5 py-3.5 lg:px-7 ${
                i !== data.length - 1 ? "border-b border-[#F5F6F9]" : ""
              }`}
            >
              <span className="text-[13.5px] font-semibold text-ink">
                {NOTIFICATION_CATEGORY_LABELS[pref.category] ?? pref.category}
              </span>
              {channels.map((c) => (
                <span key={c.key} className="flex justify-center">
                  <Switch checked={pref[c.key]} onCheckedChange={(v) => toggle(pref, c.key, v)} />
                </span>
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
