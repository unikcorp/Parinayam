"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ConversationList } from "@/components/messaging/conversation-list";
import { ChatWindow } from "@/components/messaging/chat-window";
import { cn } from "@/lib/utils";

function MessagesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("c") ? Number(searchParams.get("c")) : null;
  const [mobileShowChat, setMobileShowChat] = useState(activeId != null);

  function selectConversation(id: number) {
    router.push(`/messages?c=${id}`);
    setMobileShowChat(true);
  }

  return (
    <div className="lg:grid lg:h-[calc(100vh-61px)] lg:grid-cols-[400px_1fr]">
      <ConversationList
        activeId={activeId}
        onSelect={selectConversation}
        className={cn(
          "h-full border-r border-card-border",
          mobileShowChat ? "hidden lg:flex" : "flex"
        )}
      />
      <ChatWindow
        conversationId={activeId}
        onBack={() => setMobileShowChat(false)}
        className={cn(
          "h-full",
          mobileShowChat
            ? "fixed inset-0 z-40 flex lg:static lg:z-auto"
            : "hidden lg:flex"
        )}
      />
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesPageInner />
    </Suspense>
  );
}
