import { useQuery } from "@tanstack/react-query";
import { fetchConversations } from "@/data/conversations.data";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });
}
