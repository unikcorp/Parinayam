import Link from "next/link";
import { MessageCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { InterestButton } from "@/features/interests/components/InterestButton";
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
      <Link href={`/profile/${result.id}`} className="relative block h-55 w-full">
        <MemberProfilePhoto
          photoUrl={result.photoUrl}
          // Search only ever returns approved photos for other members (see
          // member-search.repository.ts) — never expose a pending upload.
          approvalStatus={result.photoUrl ? "APPROVED" : null}
          gender={result.gender}
          name={result.name}
          className="absolute inset-0 h-full w-full"
        />
        {result.match != null && (
          <span className="absolute right-2.5 bottom-2.5 rounded-full bg-primary-deep px-2.5 py-1 text-[11.5px] font-extrabold text-white">
            {result.match}% match
          </span>
        )}
      </Link>
      <div className="p-4.5">
        <Link href={`/profile/${result.id}`} className="flex items-center gap-1.5">
          <span className="truncate text-[15.5px] font-extrabold text-primary-deep">
            {result.name}, {result.age}
          </span>
          {result.verified && (
            <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <svg viewBox="0 0 24 24" className="size-2.5" fill="currentColor">
                <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
              </svg>
            </span>
          )}
        </Link>
        <div className="mt-1 truncate text-[13px] text-muted-foreground">{result.occupation ?? "—"}</div>
        <div className="mt-0.5 truncate text-xs text-faint">
          {result.height ?? "—"} · {result.place || "—"}
        </div>
        <div className="mt-3.5 flex gap-2">
          <InterestButton memberId={result.id} className="flex-1" />
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
