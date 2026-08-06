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
import { FilterChip } from "@/components/shared/filter-chip";
import { Pagination } from "@/components/shared/pagination";
import { FiltersSidebar } from "@/components/search/filters-sidebar";
import { SearchResultCard } from "@/components/search/result-card";
import { SearchResultListItem } from "@/components/search/result-list-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchResults } from "@/hooks/use-search-results";
import { searchSortOptions } from "@/data/search-results.data";

export default function SearchPage() {
  const { data: results = [], isLoading } = useSearchResults();
  const [view, setView] = useState<"grid" | "list">("list");
  const [sort, setSort] = useState(searchSortOptions[0]);
  const [page, setPage] = useState(1);
  const [chips, setChips] = useState([
    "Age 26–34",
    "Ernakulam",
    "Never married",
    "No dosham",
  ]);

  return (
    <div className="lg:grid lg:grid-cols-[316px_1fr] lg:items-start lg:gap-7 lg:px-12 lg:py-7">
      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-20 border-b border-card-border bg-card px-5 pt-4 pb-3.5 lg:hidden">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="text-xl font-extrabold text-primary-deep">Search</div>
          <div className="text-[12.5px] font-bold text-primary">248 matches</div>
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
              <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-peach text-[10px] font-extrabold text-white">
                4
              </span>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl p-6">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-input" />
              <FiltersSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* MOBILE FILTER CHIPS + SORT */}
      <div className="pn-scroll-x flex gap-2 overflow-x-auto px-5 pt-3 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
        {chips.map((c, i) => (
          <FilterChip
            key={c}
            active
            onRemove={() => setChips((cs) => cs.filter((_, ci) => ci !== i))}
            className="shrink-0 px-4 py-2 text-[12.5px]"
          >
            {c}
          </FilterChip>
        ))}
      </div>
      <div className="flex items-center justify-between px-5 py-3 lg:hidden">
        <div className="text-[12.5px] font-semibold text-faint">
          Sorted by <b className="text-primary-deep">{sort}</b> ▾
        </div>
        <ViewToggle view={view} setView={setView} />
      </div>

      {/* DESKTOP SIDEBAR */}
      <FiltersSidebar
        className="sticky top-24.5 hidden rounded-[20px] border border-card-border bg-card p-6 lg:block"
      />

      {/* RESULTS */}
      <div className="px-5 py-4 lg:px-0 lg:py-0">
        <div className="mb-4 hidden items-center justify-between lg:flex">
          <div>
            <div className="text-[22px] font-extrabold text-primary-deep">
              248 matches found
            </div>
            <div className="mt-0.5 text-[13.5px] text-faint">
              Grooms · 26–34 yrs · Kerala · Veluthedathu Nair
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={sort} onValueChange={(v) => v && setSort(v)}>
              <SelectTrigger className="h-auto rounded-xl border-input px-4 py-2.5 text-[13.5px] font-bold text-primary-deep">
                <span className="text-faint">Sort:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {searchSortOptions.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ViewToggle view={view} setView={setView} />
          </div>
        </div>

        <div className="mb-5 hidden flex-wrap gap-2 lg:flex">
          {chips.map((c, i) => (
            <FilterChip
              key={c}
              active
              onRemove={() => setChips((cs) => cs.filter((_, ci) => ci !== i))}
              className="px-4 py-2 text-[12.5px]"
            >
              {c}
            </FilterChip>
          ))}
        </div>

        {isLoading ? (
          <p className="py-16 text-center text-sm text-faint">Loading matches…</p>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <SearchResultCard key={r.name} result={r} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {results.map((r) => (
              <SearchResultListItem key={r.name} result={r} />
            ))}
          </div>
        )}

        <div className="mt-9 hidden justify-center lg:flex">
          <Pagination page={page} totalPages={42} onPageChange={setPage} />
        </div>

        <div className="mt-2 flex justify-center lg:hidden">
          <Button variant="outline">Load more profiles</Button>
        </div>
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
