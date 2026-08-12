"use client";

import { useState } from "react";
import { Search as SearchIcon, Settings2, LayoutGrid, List } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/shared/pagination";
import { FiltersSidebar } from "@/components/search/filters-sidebar";
import { SearchResultCard } from "@/components/search/result-card";
import { SearchResultListItem } from "@/components/search/result-list-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchResults } from "@/hooks/use-search-results";
import { useRegistrationLookups } from "@/features/registration-wizard/use-registration-lookups";
import type { SearchFilters } from "@/types/profile";

const sortOptions: { label: string; value: SearchFilters["sort"] }[] = [
  { label: "Best match", value: "match" },
  { label: "Newest first", value: "newest" },
];

const defaultFilters: SearchFilters = { ageMin: 21, ageMax: 45, sort: "match", page: 1, limit: 12 };

export default function SearchPage() {
  const lookups = useRegistrationLookups();
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const { data, isLoading, isError } = useSearchResults(filters);
  const [view, setView] = useState<"grid" | "list">("list");

  const results = data?.results ?? [];
  const pagination = data?.pagination;
  const sortLabel = sortOptions.find((o) => o.value === filters.sort)?.label ?? "Best match";

  function applyFilters(next: SearchFilters) {
    setFilters({ ...next, sort: filters.sort, page: 1, limit: filters.limit });
  }

  function setSort(sort: SearchFilters["sort"]) {
    setFilters((f) => ({ ...f, sort, page: 1 }));
  }

  function setPage(page: number) {
    setFilters((f) => ({ ...f, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="lg:grid lg:grid-cols-[316px_1fr] lg:items-start lg:gap-7 lg:px-12 lg:py-7">
      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-20 border-b border-card-border bg-card px-5 pt-4 pb-3.5 lg:hidden">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="text-xl font-extrabold text-primary-deep">Search</div>
          <div className="text-[12.5px] font-bold text-primary">{pagination?.total ?? 0} matches</div>
        </div>
        <div className="flex gap-2.5">
          <div className="flex flex-1 items-center gap-2.5 rounded-[13px] border border-input bg-surface px-4 py-3.5 text-sm text-faint">
            <SearchIcon className="size-4" /> Name, profession, district…
          </div>
          <Sheet>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className="relative flex size-12 shrink-0 items-center justify-center rounded-[13px] bg-primary text-white shadow-cta"
                />
              }
            >
              <Settings2 className="size-[18px]" />
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl p-6">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-input" />
              <FiltersSidebar lookups={lookups} onApply={applyFilters} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex items-center justify-between px-5 py-3 lg:hidden">
        <div className="text-[12.5px] font-semibold text-faint">
          Sorted by <b className="text-primary-deep">{sortLabel}</b>
        </div>
        <ViewToggle view={view} setView={setView} />
      </div>

      {/* DESKTOP SIDEBAR */}
      <FiltersSidebar
        lookups={lookups}
        onApply={applyFilters}
        className="sticky top-24.5 hidden rounded-[20px] border border-card-border bg-card p-6 lg:block"
      />

      {/* RESULTS */}
      <div className="px-5 py-4 lg:px-0 lg:py-0">
        <div className="mb-4 hidden items-center justify-between lg:flex">
          <div>
            <div className="text-[22px] font-extrabold text-primary-deep">
              {pagination ? `${pagination.total} match${pagination.total === 1 ? "" : "es"} found` : "Searching…"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={filters.sort} onValueChange={(v) => v && setSort(v as SearchFilters["sort"])}>
              <SelectTrigger className="h-auto rounded-xl border-input px-4 py-2.5 text-[13.5px] font-bold text-primary-deep">
                <span className="text-faint">Sort:</span>
                <SelectValue>{sortLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value!}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ViewToggle view={view} setView={setView} />
          </div>
        </div>

        {isLoading ? (
          <p className="py-16 text-center text-sm text-faint">Loading matches…</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-sm font-semibold text-destructive">Unable to load search results.</p>
            <p className="text-sm text-faint">Please try again.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-sm font-semibold text-ink">No matches found</p>
            <p className="text-sm text-faint">Try widening your filters.</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <SearchResultCard key={r.id} result={r} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {results.map((r) => (
              <SearchResultListItem key={r.id} result={r} />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-9 hidden justify-center lg:flex">
            <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
          </div>
        )}

        {pagination && pagination.page < pagination.totalPages && (
          <div className="mt-2 flex justify-center lg:hidden">
            <Button variant="outline" onClick={() => setPage((filters.page ?? 1) + 1)}>
              Load more profiles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ViewToggle({
  view,
  setView,
}: {
  view: "grid" | "list";
  setView: (v: "grid" | "list") => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-input bg-card">
      <button
        type="button"
        onClick={() => setView("grid")}
        className={cn(
          "flex items-center px-3 py-2.5",
          view === "grid" ? "bg-surface-blue text-primary" : "text-faint"
        )}
        aria-label="Grid view"
      >
        <LayoutGrid className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => setView("list")}
        className={cn(
          "flex items-center px-3 py-2.5",
          view === "list" ? "bg-surface-blue text-primary" : "text-faint"
        )}
        aria-label="List view"
      >
        <List className="size-4" />
      </button>
    </div>
  );
}
