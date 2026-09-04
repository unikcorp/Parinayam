import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export function privacyImageUrl(image: string | null): string | null {
  if (!image) return null;
  return `${API_BASE}/uploads/${image}`;
}

// Public — the admin-uploaded "Your privacy comes first" section image
// (Site Settings > Home Page Banner), if any. Falls back to the curated
// stock photo when unset.
export function usePrivacyImage() {
  return useQuery({
    queryKey: ["site-privacy-image"],
    queryFn: () => api.get<{ image: string | null }>("/api/site-settings/privacy-image"),
    staleTime: 5 * 60 * 1000,
  });
}
