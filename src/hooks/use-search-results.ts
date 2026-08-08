import { useQuery } from "@tanstack/react-query";
import { fetchSearchResults } from "@/data/search-results.data";

export function useSearchResults() {
  return useQuery({
    queryKey: ["search-results"],
    queryFn: fetchSearchResults,
  });
}
