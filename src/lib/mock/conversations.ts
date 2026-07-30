export interface Conversation {
  id: string;
  name: string;
  last: string;
  when: string;
  unread: number;
  online: boolean;
  emphasized?: boolean;
}

export const conversations: Conversation[] = [
  { id: "arjun", name: "Arjun Nair", last: "Would your family be open to…", when: "now", unread: 2, online: true, emphasized: true },
  { id: "sreejith", name: "Sreejith M", last: "Voice message · 0:24", when: "1 hr", unread: 1, online: false },
  { id: "kiran", name: "Kiran P", last: "You: Thank you for accepting 😊", when: "Tue", unread: 0, online: true },
  { id: "vishnu", name: "Vishnu P", last: "Our horoscopes matched 9/10!", when: "Mon", unread: 0, online: false },
  { id: "hari", name: "Hari K", last: "You: Nice meeting your family", when: "Jun 28", unread: 0, online: false },
];

export const interestRequest = {
  name: "Devika K, 26",
  when: "2 hr ago",
};
