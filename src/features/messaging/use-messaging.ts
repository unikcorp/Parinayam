import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import {
  getConversationsRequest,
  getMessagesRequest,
  getUnreadCountRequest,
  sendMessageRequest,
  startConversationRequest,
} from "./api";
import type { MessageRecord } from "@/types/messaging";

const CONVERSATIONS_KEY = ["conversations"];
const UNREAD_COUNT_KEY = ["messages-unread-count"];
const messagesKey = (conversationId: number) => ["messages", conversationId];

export function useConversations() {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: CONVERSATIONS_KEY,
    queryFn: getConversationsRequest,
    enabled: isAuthenticated && !isRestoring,
  });
}

export function useUnreadMessageCount() {
  const { isAuthenticated, isRestoring } = useAuth();
  return useQuery({
    queryKey: UNREAD_COUNT_KEY,
    queryFn: getUnreadCountRequest,
    enabled: isAuthenticated && !isRestoring,
    select: (data) => data.count,
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) => startConversationRequest(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Could not start the conversation. Please try again.");
    },
  });
}

// Fetching a conversation's messages also marks them read server-side, so a
// successful load refreshes the unread badge and the conversation list's
// unread count/preview to match.
export function useMessages(conversationId: number | null) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: conversationId != null ? messagesKey(conversationId) : ["messages", "none"],
    queryFn: () => getMessagesRequest(conversationId as number),
    enabled: conversationId != null,
  });

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    }
    // Only when a fresh load completes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.isSuccess, query.dataUpdatedAt]);

  return query;
}

export function useSendMessage(conversationId: number | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => sendMessageRequest(conversationId as number, body),
    onSuccess: (message) => {
      if (conversationId == null) return;
      queryClient.setQueryData<MessageRecord[]>(messagesKey(conversationId), (old) =>
        old ? [...old, message] : [message],
      );
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Could not send the message. Please try again.");
    },
  });
}
