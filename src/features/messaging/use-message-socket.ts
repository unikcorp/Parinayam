"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "@/context/auth-context";
import type { MessageRecord } from "@/types/messaging";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// Same pattern as features/notifications/use-notification-socket.ts — live
// delivery shortcut only. Appends the message straight into any already-open
// conversation's cache, and refreshes the conversation list / unread badge
// so a chat that isn't currently open still shows the new preview/count.
export function useMessageSocket() {
  const { isAuthenticated, isRestoring } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || isRestoring) return;

    const socket: Socket = io(SOCKET_URL, { withCredentials: true });

    socket.on(
      "message:new",
      ({ conversationId, message }: { conversationId: number; message: MessageRecord }) => {
        queryClient.setQueryData<MessageRecord[]>(["messages", conversationId], (old) =>
          old ? [...old, message] : old,
        );
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        queryClient.invalidateQueries({ queryKey: ["messages-unread-count"] });
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, isRestoring, queryClient]);
}
