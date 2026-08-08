export interface Conversation {
  id: string;
  name: string;
  last: string;
  when: string;
  unread: number;
  online: boolean;
  emphasized?: boolean;
}
