import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Testimonial } from "@/types/content";

interface TestimonialRecord {
  id: number;
  name: string;
  meta: string;
  quote: string;
  rating: number;
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

function toDisplayTestimonial(record: TestimonialRecord): Testimonial {
  return {
    id: record.id,
    initials: initialsFor(record.name),
    name: record.name,
    meta: record.meta,
    quote: record.quote,
    rating: record.rating,
  };
}

// Public — admin-curated testimonials (Site Settings > Testimonials) shown
// on the landing page. No fallback to sample data: an empty result means
// no testimonials have been added yet, and callers should render nothing.
export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials-published"],
    queryFn: async () => {
      const records = await api.get<TestimonialRecord[]>("/api/testimonials/published");
      return records.map(toDisplayTestimonial);
    },
  });
}
