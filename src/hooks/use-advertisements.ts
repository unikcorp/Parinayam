import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Advertisement {
  advertisement_id: number;
  title: string;
  image: string | null;
  link_url: string | null;
  display_order: number;
  status: "APPROVED" | "UNAPPROVED";
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export function advertisementImageUrl(image: string | null): string | null {
  if (!image) return null;
  return `${API_BASE}/uploads/${image}`;
}

// Public — admin-uploaded ads (Site Settings > Advertise), shown in display order.
export function useAdvertisements() {
  return useQuery({
    queryKey: ["advertisements-published"],
    queryFn: () => api.get<Advertisement[]>("/api/advertise/published"),
    staleTime: 5 * 60 * 1000,
  });
}
