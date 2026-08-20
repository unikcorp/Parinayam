import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CmsPageData {
  cms_id: number;
  page_name: string;
  cms_title: string;
  cms_content: string;
  status: "APPROVED" | "UNAPPROVED";
}

// Public static pages (About, Terms, Privacy, ...) — only ever returns
// approved content; the server 404s for anything unapproved or missing.
export function useCmsPage(pageName: string) {
  return useQuery({
    queryKey: ["cms-page", pageName],
    queryFn: () => api.get<CmsPageData>(`/api/cms-pages/page/${pageName}`),
  });
}
