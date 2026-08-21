import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface FaqData {
  faq_id: number;
  question: string;
  answer: string;
  sort_order: number;
  status: "APPROVED" | "UNAPPROVED";
}

// Public Help page — only ever returns approved FAQs, in display order.
export function useFaqs() {
  return useQuery({
    queryKey: ["faqs-published"],
    queryFn: () => api.get<FaqData[]>("/api/faqs/published"),
  });
}
