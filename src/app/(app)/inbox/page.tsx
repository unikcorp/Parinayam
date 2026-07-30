"use client";

import { useState } from "react";
import { ConversationList } from "@/components/inbox/conversation-list";
import { ChatWindow } from "@/components/inbox/chat-window";
import { cn } from "@/lib/utils";

export default function InboxPage() {
  const [activeId, setActiveId] = useState("arjun");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  function selectConversation(id: string) {
    setActiveId(id);
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
