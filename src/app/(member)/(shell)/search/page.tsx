"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Search as SearchIcon, Settings2, LayoutGrid, List, MapPin } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiltersSidebar } from "@/components/search/filters-sidebar";
import { SearchResultCard } from "@/components/search/result-card";
import { SearchResultListItem } from "@/components/search/result-list-item";
import { FilterChip } from "@/components/shared/filter-chip";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api";
import { useInfiniteSearchResults } from "@/hooks/use-search-results";
import { useRegistrationLookups } from "@/features/registration-wizard/use-registration-lookups";
import type { SearchFilters } from "@/types/profile";
import { ProfileCardGridSkeleton } from "@/components/shared/loading-skeletons";

const RADIUS_OPTIONS = [25, 50, 100, 200] as const;

const sortOptions: { label: string; value: SearchFilters["sort"] }[] = [
  { label: "Best match", value: "match" },
  { label: "Newest first", value: "newest" },
];

const defaultFilters: Omit<SearchFilters, "page"> = { ageMin: 21, ageMax: 45, sort: "match", limit: 12 };

export default function SearchPage() {
  const lookups = useRegistrationLookups();
  const [filters, setFilters] = useState<Omit<SearchFilters, "page">>(defaultFilters);
  // Standalone quick-filter, independent of the Filters sidebar's own Apply
  // flow — toggling it doesn't disturb whatever district/age/etc. filters
  // are already applied. When no district is selected, the backend centers
  // it on the viewer's own district instead.
  const [nearbyOn, setNearbyOn] = useState(false);
  const [radius, setRadius] = useState<(typeof RADIUS_OPTIONS)[number]>(50);
  // Omit the key entirely when off, rather than sending `nearby=false` —
  // query params are always strings, so `false` isn't a safe value to rely
  // on the server treating as falsy. `radius` is part of this object too, so
  // changing it is just a normal query-key change — TanStack Query resets
  // pagination and refetches from page 1 automatically, no extra code needed.
  const queryFilters: Omit<SearchFilters, "page"> = nearbyOn ? { ...filters, nearby: true, radius } : filters;
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteSearchResults(queryFilters);
  const [view, setView] = useState<"grid" | "list">("list");

  const results = data?.pages.flatMap((p) => p.results) ?? [];
  const total = data?.pages[0]?.pagination.total;
  // The backend widens the search itself when nobody is within the chosen
  // radius (still sorted nearest-first) rather than returning nothing —
  // every page reports the same value for a given radius/district, so the
  // first page is all that's needed to decide whether to show the banner.
  const isNearbyFallback = nearbyOn && !!data?.pages[0]?.isFallback;
  const sortLabel = sortOptions.find((o) => o.value === filters.sort)?.label ?? "Best match";

  // Loads the next page automatically once the sentinel below the results
  // scrolls near the viewport — "See all" means everything shows up as you
  // scroll, not a page-number picker.
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  function applyFilters(next: SearchFilters) {
    const { page: _page, ...rest } = next;
    setFilters({ ...rest, sort: filters.sort, limit: filters.limit });
  }

  function setSort(sort: SearchFilters["sort"]) {
    setFilters((f) => ({ ...f, sort }));
  }

  return (
    <div className="lg:grid lg:grid-cols-[316px_1fr] lg:items-start lg:gap-7 lg:px-12 lg:py-7">
      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-20 border-b border-card-border bg-card px-5 pt-4 pb-3.5 lg:hidden">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="text-xl font-extrabold text-primary-deep">Search</div>
          <div className="text-[12.5px] font-bold text-primary">{total ?? 0} matches</div>
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
        <div className="flex items-center gap-2">
          <NearbyToggle active={nearbyOn} onClick={() => setNearbyOn((v) => !v)} />
          <ViewToggle view={view} setView={setView} />
        </div>
      </div>
      {nearbyOn && (
        <div className="px-5 pb-3 lg:hidden">
          <RadiusChips radius={radius} onChange={setRadius} />
        </div>
      )}

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
              {total != null ? `${total} match${total === 1 ? "" : "es"} found` : "Searching…"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NearbyToggle active={nearbyOn} onClick={() => setNearbyOn((v) => !v)} />
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
        {nearbyOn && (
          <div className="mb-4 hidden lg:block">
            <RadiusChips radius={radius} onChange={setRadius} />
          </div>
        )}
        {isNearbyFallback && results.length > 0 && (
          <div className="mb-4 rounded-xl border border-gold/30 bg-peach-bg px-4 py-3 text-[13px] font-semibold text-primary-deep">
            No one within {radius} km — here are the closest members instead.
          </div>
        )}

        {isLoading ? (
          <ProfileCardGridSkeleton count={8} />
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-sm font-semibold text-destructive">
              {error instanceof ApiError ? error.message : "Unable to load search results."}
            </p>
            <p className="text-sm text-faint">Please try again.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-sm font-semibold text-ink">
              {nearbyOn ? "No members with a location set were found." : "No matches found"}
            </p>
            <p className="text-sm text-faint">
              {nearbyOn ? "Try adjusting your other filters." : "Try widening your filters."}
            </p>
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

        {/* scroll sentinel — comes into view near the bottom and triggers the next page */}
        {results.length > 0 && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-sm text-faint">
                <Loader2 className="size-4 animate-spin" /> Loading more…
              </div>
            ) : !hasNextPage ? (
              <p className="text-sm text-faint">You&apos;ve seen every match.</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function RadiusChips({
  radius,
  onChange,
}: {
  radius: (typeof RADIUS_OPTIONS)[number];
  onChange: (radius: (typeof RADIUS_OPTIONS)[number]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {RADIUS_OPTIONS.map((option) => (
        <FilterChip key={option} active={radius === option} onClick={() => onChange(option)}>
          {option} KM
        </FilterChip>
      ))}
    </div>
  );
}

function NearbyToggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-[13.5px] font-bold transition-colors",
        active
          ? "border-primary bg-primary text-white"
          : "border-input bg-card text-primary-deep hover:border-primary"
      )}
    >
      <MapPin className="size-4" />
      Nearby
    </button>
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
