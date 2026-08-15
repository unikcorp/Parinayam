import { api } from "@/lib/api";
import type { ConversationSummary, MessageRecord } from "@/types/messaging";

export function getConversationsRequest() {
  return api.get<ConversationSummary[]>("/api/members/me/conversations");
}

export function getUnreadCountRequest() {
  return api.get<{ count: number }>("/api/members/me/conversations/unread-count");
}

export function startConversationRequest(memberId: number) {
  return api.post<{ id: number }>(`/api/members/me/conversations/${memberId}`);
}

export function getMessagesRequest(conversationId: number) {
  return api.get<MessageRecord[]>(`/api/members/me/conversations/${conversationId}/messages`);
}

export function sendMessageRequest(conversationId: number, body: string) {
  return api.post<MessageRecord>(`/api/members/me/conversations/${conversationId}/messages`, { body });
}
