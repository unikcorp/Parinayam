// One row from GET /members/me/conversations — the other participant's
// display info plus a last-message preview, joined server-side.
export interface ConversationSummary {
  id: number;
  last_message_at: string | null;
  member_id: number;
  member_code: string;
  first_name: string;
  last_name: string;
  gender: "Male" | "Female" | string;
  photo_url: string | null;
  last_message: string | null;
  unread_count: number;
}

export interface MessageRecord {
  id: number;
  conversation_id: number;
  sender_member_id: number;
  body: string;
  is_read: boolean;
  created_at: string;
}
