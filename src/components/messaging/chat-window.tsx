"use client";

import { useState } from "react";
import { ArrowLeft, Paperclip, Mic, Send, Phone, User, MoreHorizontal } from "lucide-react";
import { ImageSlot } from "@/components/shared/image-slot";
import { ChatBubble, TypingDots } from "@/components/shared/chat-bubble";
import { VoiceWave } from "@/components/shared/voice-wave";
import { useConversations } from "@/hooks/use-conversations";
import { cn } from "@/lib/utils";

export function ChatWindow({
  conversationId,
  onBack,
  className,
}: {
  conversationId: string;
  onBack?: () => void;
  className?: string;
}) {
  const { data: conversations = [] } = useConversations();
  const [draft, setDraft] = useState("");
  const convo = conversations.find((c) => c.id === conversationId) ?? conversations[0];

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
          <div className="relative">
            <ImageSlot label="p" className="size-10.5 rounded-full lg:size-11.5" />
            <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-success" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[15.5px] font-extrabold text-primary-deep">
                {convo.name}
              </span>
              <span className="flex size-3.5 items-center justify-center rounded-full bg-primary text-white">
                <svg viewBox="0 0 24 24" className="size-2" fill="currentColor">
                  <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                </svg>
              </span>
            </div>
            <div className="text-xs font-bold text-success">Online now</div>
          </div>
        </div>
        <div className="flex gap-2">
          <IconButton icon={Phone} />
          <IconButton icon={User} className="hidden lg:flex" />
          <IconButton icon={MoreHorizontal} />
        </div>
      </div>

      {/* messages */}
      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-5 lg:px-8">
        <span className="mx-auto mb-3.5 rounded-full bg-surface-blue px-4 py-1.5 text-xs font-bold text-primary">
          You matched on 12 June · 92% compatible
        </span>

        <ChatBubble from="other" time="10:24 AM" className="max-w-[78%] lg:max-w-[55%]">
          Namaskaram Anjali 🙏 My parents mentioned your family after the temple
          festival. Happy to finally connect here.
        </ChatBubble>

        <ChatBubble from="self" time="10:26 AM" read className="max-w-[78%] lg:max-w-[55%]">
          Namaskaram! Yes, Amma was very happy after speaking to your mother 😊
          She hasn&apos;t stopped talking about it.
        </ChatBubble>

        <div className="max-w-[82%] lg:max-w-[55%]">
          <VoiceWave duration="0:18" />
        </div>
        <div className="mb-1 text-[11px] text-faint">10:31 AM</div>

        <div className="ml-auto flex max-w-[78%] flex-col items-end lg:max-w-[55%]">
          <div className="overflow-hidden rounded-[16px_16px_4px_16px] bg-primary p-1.5">
            <ImageSlot label="Shared photo" className="h-40 w-58 rounded-xl lg:h-45 lg:w-65" />
            <div className="px-2 pt-2 pb-1 text-[13px] text-white">
              From our Munnar trip last month 🍃
            </div>
          </div>
          <div className="mt-1 text-[11px] text-faint">
            10:34 AM · <span className="font-bold text-primary">✓✓ Read</span>
          </div>
        </div>

        <ChatBubble from="other" className="max-w-[78%] lg:max-w-[55%]">
          Would your family be open to a call this weekend?
        </ChatBubble>
        <TypingDots />
      </div>

      {/* composer */}
      <div className="flex shrink-0 items-center gap-2.5 border-t border-card-border bg-card px-4 py-3.5 lg:px-7 lg:py-4">
        <IconButton icon={Paperclip} />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-[13px] border border-input bg-surface px-4.5 py-3.5 text-sm outline-none placeholder:text-faint focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <IconButton icon={Mic} />
        <button
          type="button"
          className="flex size-11.5 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-cta"
          aria-label="Send"
        >
          <Send className="size-4.5" />
        </button>
      </div>
    </main>
  );
}

function IconButton({
  icon: Icon,
  className,
}: {
  icon: typeof Phone;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex size-11 items-center justify-center rounded-xl border border-input bg-card text-muted-foreground",
        className
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
