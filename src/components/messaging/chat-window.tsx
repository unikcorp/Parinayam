"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, User } from "lucide-react";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { ChatBubble } from "@/components/shared/chat-bubble";
import { ContactButton } from "@/components/profile/contact-button";
import { useAuth } from "@/context/auth-context";
import { useConversations, useMessages, useSendMessage } from "@/features/messaging/use-messaging";
import { useMembership } from "@/features/membership/use-membership";
import { UpgradePrompt } from "@/features/membership/components/UpgradePrompt";
import { UsageIndicator } from "@/features/membership/components/UsageIndicator";
import { cn } from "@/lib/utils";

// Same UTC-reattachment as lib/format-time.ts, but a clock time reads better
// than "2h ago" inside a message transcript.
function formatMessageTime(mysqlDatetime: string): string {
  const date = new Date(`${mysqlDatetime.replace(" ", "T")}Z`);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function ChatWindow({
  conversationId,
  onBack,
  className,
}: {
  conversationId: number | null;
  onBack?: () => void;
  className?: string;
}) {
  const { user } = useAuth();
  const { data: conversations = [] } = useConversations();
  const { data: messages = [], isLoading } = useMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);
  const { isLoading: membershipLoading, canSendMessage } = useMembership();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const convo = conversations.find((c) => c.id === conversationId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    sendMessage.mutate(body);
  }

  if (conversationId == null) {
    return (
      <main className={cn("hidden items-center justify-center bg-[#FBFBFC] text-sm text-faint lg:flex", className)}>
        Select a conversation to start chatting.
      </main>
    );
  }

  if (!convo) return null;

  return (
    <main className={cn("flex-col bg-[#FBFBFC]", className)}>
      {/* header */}
      <div className="flex shrink-0 items-center justify-between border-b border-card-border bg-card px-5 py-3.5 lg:px-7">
        <div className="flex items-center gap-3.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex size-9.5 items-center justify-center rounded-[10px] bg-muted text-primary-deep lg:hidden"
            >
              <ArrowLeft className="size-4" />
            </button>
          )}
          <MemberProfilePhoto
            photoUrl={convo.photo_url}
            approvalStatus={convo.photo_url ? "APPROVED" : null}
            gender={convo.gender}
            name={`${convo.first_name} ${convo.last_name}`}
            className="size-10.5 rounded-full lg:size-11.5"
            showMessage={false}
          />
          <div>
            <span className="text-[15.5px] font-extrabold text-primary-deep">
              {convo.first_name} {convo.last_name}
            </span>
            <div className="text-xs text-faint">{convo.member_code}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <ContactButton memberId={convo.member_id} size="icon-cta" variant="outline" iconOnly />
          <Link
            href={`/profile/${convo.member_id}`}
            className="hidden size-11 items-center justify-center rounded-xl border border-input bg-card text-muted-foreground lg:flex"
            aria-label="View profile"
          >
            <User className="size-4" />
          </Link>
        </div>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-5 lg:px-8">
        {isLoading ? (
          <div className="py-10 text-center text-sm text-faint">Loading…</div>
        ) : messages.length === 0 ? (
          <div className="py-10 text-center text-sm text-faint">
            No messages yet. Say hello to {convo.first_name}!
          </div>
        ) : (
          messages.map((m) => (
            <ChatBubble
              key={m.id}
              from={String(m.sender_member_id) === user?.id ? "self" : "other"}
              time={formatMessageTime(m.created_at)}
              read={m.is_read}
              className="max-w-[78%] lg:max-w-[55%]"
            >
              {m.body}
            </ChatBubble>
          ))
        )}
      </div>

      {/* composer */}
      {!membershipLoading && !canSendMessage ? (
        <div className="shrink-0 border-t border-card-border bg-card px-4 py-3.5 lg:px-7 lg:py-4">
          <UpgradePrompt feature="Messages" message="You've used all your messages for this plan." />
        </div>
      ) : (
        <div className="shrink-0 border-t border-card-border bg-card px-4 pt-2.5 pb-3.5 lg:px-7 lg:pt-3 lg:pb-4">
          <UsageIndicator type="messages" className="mb-2" />
          <form onSubmit={handleSend} className="flex items-center gap-2.5">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-[13px] border border-input bg-surface px-4.5 py-3.5 text-sm outline-none placeholder:text-faint focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <button
              type="submit"
              disabled={!draft.trim() || sendMessage.isPending}
              className="flex size-11.5 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-cta disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="size-4.5" />
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
