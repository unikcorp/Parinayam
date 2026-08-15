import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { SearchFilters, SearchResult } from "@/types/profile";

interface SearchResultRow {
  id: number;
  member_code: string;
  first_name: string;
  last_name: string;
  gender: "Male" | "Female" | string;
  height: string | null;
  age: number;
  marital_status: string | null;
  religion_name: string | null;
  caste_name: string | null;
  sub_caste_name: string | null;
  state_name: string | null;
  district_name: string | null;
  occupation_name: string | null;
  profile_photo_url: string | null;
  document_status: "PENDING" | "APPROVED" | "REJECTED" | null;
  match_percent: number | null;
}

function buildQueryString(filters: SearchFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  return params.toString();
}

function toSearchResult(row: SearchResultRow): SearchResult {
  return {
    id: row.id,
    memberCode: row.member_code,
    name: `${row.first_name} ${row.last_name}`,
    age: row.age,
    gender: row.gender,
    height: row.height,
    occupation: row.occupation_name,
    place: [row.district_name, row.state_name].filter(Boolean).join(", "),
    religion: row.religion_name,
    caste: [row.caste_name, row.sub_caste_name].filter(Boolean).join(" · ") || null,
    photoUrl: row.profile_photo_url,
    verified: row.document_status === "APPROVED",
    match: row.match_percent,
  };
}

export function useSearchResults(filters: SearchFilters) {
  return useQuery({
    queryKey: ["search-results", filters],
    queryFn: async () => {
      const { data, pagination } = await api.getPaginated<SearchResultRow[]>(
        `/api/members/search?${buildQueryString(filters)}`
      );
      return { results: data.map(toSearchResult), pagination };
    },
  });
}

// "See all" destinations (currently /search) — loads page 1 up front, then
// pulls in the next page automatically as the user scrolls near the bottom,
// accumulating every match instead of paging through them.
export function useInfiniteSearchResults(filters: Omit<SearchFilters, "page">) {
  return useInfiniteQuery({
    queryKey: ["search-results-infinite", filters],
    queryFn: async ({ pageParam }) => {
      const { data, pagination } = await api.getPaginated<SearchResultRow[]>(
        `/api/members/search?${buildQueryString({ ...filters, page: pageParam })}`
      );
      return { results: data.map(toSearchResult), pagination };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages ? lastPage.pagination.page + 1 : undefined,
  });
}
