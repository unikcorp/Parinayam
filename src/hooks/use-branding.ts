import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface BrandingData {
  logo: string | null;
  favicon: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export function brandingImageUrl(image: string | null): string | null {
  if (!image) return null;
  return `${API_BASE}/uploads/${image}`;
}

// Public — the admin-uploaded logo/favicon, if any. Falls back to the
// default text/letter mark (brand.ts) everywhere this returns no logo.
export function useBranding() {
  return useQuery({
    queryKey: ["site-branding"],
    queryFn: () => api.get<BrandingData>("/api/site-settings/branding"),
    staleTime: 5 * 60 * 1000,
  });
}

// A custom logo is usually a full wordmark (brand name baked into the
// image) — callers use this to hide the separate "Parinayam" text next to
// it once one's uploaded, instead of showing both.
export function useHasCustomLogo(): boolean {
  const { data } = useBranding();
  return !!data?.logo;
}
