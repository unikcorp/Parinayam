import { Heart, MessageCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/shared/image-slot";
import type { SearchResult } from "@/types/profile";

export function SearchResultCard({
  result,
  className,
}: {
  result: SearchResult;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[18px] border border-card-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover",
        className
      )}
    >
      {result.premium && (
        <span className="bg-gold-gradient absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold tracking-wide text-white uppercase">
          <Star className="size-3 fill-current" /> Premium
        </span>
      )}
      <div className="relative h-55 w-full">
        <ImageSlot label="Profile photo" className="absolute inset-0" />
        {result.online && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-success">
            <span className="size-1.5 rounded-full bg-success" /> Online
          </span>
        )}
        <span className="absolute right-2.5 bottom-2.5 rounded-full bg-primary-deep px-2.5 py-1 text-[11.5px] font-extrabold text-white">
          {result.match}% match
        </span>
      </div>
      <div className="p-4.5">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[15.5px] font-extrabold text-primary-deep">
            {result.name}, {result.age}
          </span>
          <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <svg viewBox="0 0 24 24" className="size-2.5" fill="currentColor">
              <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
            </svg>
          </span>
        </div>
        <div className="mt-1 truncate text-[13px] text-muted-foreground">{result.job}</div>
        <div className="mt-0.5 truncate text-xs text-faint">
          {result.height} · {result.place}
        </div>
        <div className="mt-3.5 flex gap-2">
          <Button size="sm" className="flex-1">
            <Heart className="size-3.5" /> Interest
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Shortlist">
            <Star className="size-4" />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Message">
            <MessageCircle className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
