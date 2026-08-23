import type { FeaturedProfile } from "@/types/profile";

// Admin-picked members from the Site Settings → Featured Profiles page.
// Shared by the landing page's "Featured profiles" section and the public
// /featured-profiles preview page so both show the exact same 4 people.
export async function fetchFeaturedProfiles(): Promise<FeaturedProfile[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
    const res = await fetch(`${base}/api/site-settings/featured-members`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const body = await res.json();
    return body.data ?? [];
  } catch {
    return [];
  }
}
