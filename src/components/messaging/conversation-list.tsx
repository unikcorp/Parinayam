"use client";

import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { formatRelativeTime } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import { useConversations } from "@/features/messaging/use-messaging";

export function ConversationList({
  activeId,
  onSelect,
  className,
}: {
  activeId: number | null;
  onSelect: (id: number) => void;
  className?: string;
}) {
  const { data: conversations = [], isLoading } = useConversations();

  return (
    <aside className={cn("flex flex-col bg-card", className)}>
      <div className="px-6 pt-5.5 pb-3.5">
        <div className="text-[21px] font-extrabold text-primary-deep">Messages</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="px-6 py-10 text-center text-sm text-faint">Loading…</div>
        ) : conversations.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-faint">
            No conversations yet. Message a member from their profile to start one.
          </div>
        ) : (
          conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={cn(
                "flex w-full items-center gap-3.5 border-l-[3px] px-6 py-3.5 text-left hover:bg-surface",
                c.id === activeId
                  ? "border-primary bg-[#FDF3F3]"
                  : "border-transparent bg-card"
              )}
            >
              <MemberProfilePhoto
                photoUrl={c.photo_url}
                approvalStatus={c.photo_url ? "APPROVED" : null}
                gender={c.gender}
                name={`${c.first_name} ${c.last_name}`}
                className="size-13 shrink-0 rounded-full"
                showMessage={false}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[14.5px] font-extrabold text-primary-deep">
                    {c.first_name} {c.last_name}
                  </span>
                  {c.last_message_at && (
                    <span className="shrink-0 text-[11.5px] font-semibold text-faint">
                      {formatRelativeTime(c.last_message_at)}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "truncate text-[13px]",
                      c.unread_count > 0 ? "font-bold text-primary-deep" : "font-medium text-faint"
                    )}
                  >
                    {c.last_message ?? "Say hello 👋"}
                  </span>
                  {c.unread_count > 0 && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-extrabold text-white">
                      {c.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
