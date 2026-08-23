import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type BannerSlot = 1 | 2 | 3 | 4;
export type BannersData = Record<BannerSlot, string | null>;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export function bannerImageUrl(image: string | null): string | null {
  if (!image) return null;
  return `${API_BASE}/uploads/${image}`;
}

// Public — the admin-uploaded hero collage images (Site Settings > Home Page
// Banner), if any. Falls back to the curated stock photos wherever a slot
// hasn't been set.
export function useBanners() {
  return useQuery({
    queryKey: ["site-banners"],
    queryFn: () => api.get<BannersData>("/api/site-settings/banners"),
    staleTime: 5 * 60 * 1000,
  });
}
