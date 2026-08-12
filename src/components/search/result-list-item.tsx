import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/shared/image-slot";
import type { SearchResult } from "@/types/profile";

export function SearchResultListItem({ result }: { result: SearchResult }) {
  return (
    <div className="flex overflow-hidden rounded-[18px] border border-card-border bg-card shadow-[0_4px_16px_rgba(127,29,29,0.05)]">
      <Link href={`/profile/${result.id}`} className="relative w-31 shrink-0">
        {result.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={result.photoUrl} alt={result.name} className="h-39 w-full object-cover" />
        ) : (
          <ImageSlot label="photo" className="h-39 w-full" />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3.5">
        <Link href={`/profile/${result.id}`} className="flex items-center gap-1.5">
          <span className="truncate text-[15px] font-extrabold text-primary-deep">
            {result.name}, {result.age}
          </span>
          {result.verified && (
            <span className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <svg viewBox="0 0 24 24" className="size-2" fill="currentColor">
                <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
              </svg>
            </span>
          )}
        </Link>
        <div className="mt-0.5 truncate text-[12.5px] text-muted-foreground">{result.occupation ?? "—"}</div>
        <div className="mt-0.5 truncate text-[11.5px] text-faint">
          {result.height ?? "—"} · {result.place || "—"}
        </div>
        {result.match != null && (
          <span className="mt-2 inline-flex w-fit items-center rounded-full bg-surface-blue px-2.5 py-1 text-[11px] font-extrabold text-primary">
            {result.match}% match
          </span>
        )}
        <div className="mt-auto flex gap-2 pt-2.5">
          <Button size="sm" className="flex-1">
            <Heart className="size-3.5" /> Interest
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Shortlist">
            <Star className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
