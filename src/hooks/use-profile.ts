import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/data/profile.data";

export function useProfile(id: string) {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => fetchProfile(id),
  });
}
