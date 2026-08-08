"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { ImageSlot } from "@/components/shared/image-slot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { interestRequest } from "@/data/conversations.data";
import { useConversations } from "@/hooks/use-conversations";

export function ConversationList({
  activeId,
  onSelect,
  className,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const { data: conversations = [] } = useConversations();
  const [tab, setTab] = useState<"chats" | "requests">("chats");
  const [requestVisible, setRequestVisible] = useState(true);

  return (
    <aside className={cn("flex flex-col bg-card", className)}>
      <div className="px-6 pt-5.5 pb-3.5">
        <div className="mb-3.5 text-[21px] font-extrabold text-primary-deep">Messages</div>
        <SegmentedControl
          value={tab}
          onChange={setTab}
          className="w-full bg-muted"
          options={[
            { label: "Chats", value: "chats" },
            { label: `Requests${requestVisible ? " · 1" : ""}`, value: "requests" },
          ]}
        />
      </div>

      {tab === "chats" && requestVisible && (
        <div className="mx-5 mb-3 rounded-2xl border border-[#F0E4D6] bg-surface-cream p-4">
          <div className="mb-3 flex items-center gap-3">
            <ImageSlot label="p" className="size-11.5 shrink-0 rounded-full" />
            <div className="flex-1">
              <div className="text-sm font-extrabold text-primary-deep">
                {interestRequest.name}
              </div>
              <div className="text-xs text-faint">
                sent you an interest · {interestRequest.when}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-success hover:bg-success/90">
              <Check className="size-3.5" /> Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setRequestVisible(false)}
            >
              Decline
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {tab === "chats" ? (
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
              <div className="relative shrink-0">
                <ImageSlot label="p" className="size-13 rounded-full" />
                {c.online && (
                  <span className="absolute right-0 bottom-0.5 size-3 rounded-full border-2 border-white bg-success" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[14.5px] font-extrabold text-primary-deep">
                    {c.name}
                  </span>
                  <span className="shrink-0 text-[11.5px] font-semibold text-faint">
                    {c.when}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "truncate text-[13px]",
                      c.unread > 0 ? "font-bold text-primary-deep" : "font-medium text-faint"
                    )}
                  >
                    {c.last}
                  </span>
                  {c.unread > 0 && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-extrabold text-white">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="px-6 py-10 text-center text-sm text-faint">
            No pending requests other than above.
          </div>
        )}
      </div>
    </aside>
  );
}
