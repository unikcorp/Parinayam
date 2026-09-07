import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface BasicConfig {
  profilePicOptional: boolean;
  documentUploadOptional: boolean;
  weightStart: number;
  weightEnd: number;
  lastBirthYear: number;
  successStoryLastYear: number;
  maleLegalAge: number;
  femaleLegalAge: number;
}

// Public — admin-configured registration/profile rules (Site Settings >
// Update Basic Config). Read by the registration wizard before a member
// even has an account, so this must stay unauthenticated.
export function useBasicConfig() {
  return useQuery({
    queryKey: ["basic-config"],
    queryFn: () => api.get<BasicConfig>("/api/site-settings/basic-config"),
    staleTime: 5 * 60 * 1000,
  });
}
