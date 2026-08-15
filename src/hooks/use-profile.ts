import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PublicMemberProfileResponse } from "@/types/member-profile";

export function useProfile(id: string) {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => api.get<PublicMemberProfileResponse>(`/api/members/${id}/profile`),
    enabled: !!id,
  });
}
