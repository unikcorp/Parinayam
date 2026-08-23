import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { SuccessStory } from "@/types/content";

interface SuccessStoryRecord {
  id: number;
  partner1_name: string;
  partner2_name: string;
  marriage_date: string;
  place: string;
  description: string;
  image_path: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function toDisplayStory(record: SuccessStoryRecord): SuccessStory {
  const date = new Date(record.marriage_date);
  const when = Number.isNaN(date.getTime())
    ? record.marriage_date
    : `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;

  return {
    id: record.id,
    couple: `${record.partner1_name} & ${record.partner2_name}`,
    when,
    place: record.place,
    quote: record.description,
    image: `${API_BASE}${record.image_path}`,
  };
}

// Public — admin-curated success stories shown on the homepage teaser and
// the full /stories page. No fallback to sample data: an empty result means
// no stories have been added yet, and callers should render an empty state.
export function useSuccessStories() {
  return useQuery({
    queryKey: ["success-stories-published"],
    queryFn: async () => {
      const records = await api.get<SuccessStoryRecord[]>("/api/success-stories/published");
      return records.map(toDisplayStory);
    },
  });
}
