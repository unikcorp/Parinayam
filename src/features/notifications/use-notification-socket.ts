"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "@/context/auth-context";
import { UNREAD_NOTIFICATIONS_KEY } from "./use-notifications";
import type { NotificationRecord } from "./types";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// Socket.IO is a live-delivery shortcut only, never the source of truth —
// the handshake authenticates itself via the same httpOnly member_refreshToken
// cookie the REST client already relies on (withCredentials: true sends it
// automatically; no token wiring needed here). On every connect — the first
// one and any reconnect after a drop — we refetch GET /notifications/unread
// so a user who was offline when a notification was created still ends up
// correct, instead of trusting the socket to have delivered everything.
export function useNotificationSocket() {
  const { isAuthenticated, isRestoring } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || isRestoring) return;

    const socket: Socket = io(SOCKET_URL, { withCredentials: true });

    socket.on("connect", () => {
      queryClient.invalidateQueries({ queryKey: UNREAD_NOTIFICATIONS_KEY });
    });

    socket.on("notification:new", (notification: NotificationRecord) => {
      queryClient.setQueryData<NotificationRecord[]>(UNREAD_NOTIFICATIONS_KEY, (old) => [
        notification,
        ...(old ?? []),
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, isRestoring, queryClient]);
}
