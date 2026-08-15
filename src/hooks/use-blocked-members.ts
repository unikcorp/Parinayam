import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface BlockedMember {
  id: number;
  blocked_member_id: number;
  created_at: string;
  member_code: string;
  first_name: string;
  last_name: string;
  photo_url: string | null;
}

export function useBlockedMembers() {
  return useQuery({
    queryKey: ["blocked-members"],
    queryFn: () => api.get<BlockedMember[]>("/api/members/me/blocks"),
  });
}

export function useUnblockMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) => api.delete(`/api/members/me/blocks/${memberId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blocked-members"] }),
  });
}

export function useBlockMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) => api.post(`/api/members/me/blocks/${memberId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blocked-members"] }),
  });
}
