import Link from "next/link";
import { cn } from "@/lib/utils";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { InterestButton } from "@/features/interests/components/InterestButton";
import { MessageButton } from "@/features/messaging/components/MessageButton";
import { ShortlistButton } from "@/features/shortlist/components/ShortlistButton";
import { PremiumBadge } from "@/features/membership/components/PremiumBadge";
import { HighlightRibbon } from "@/features/profile-highlight/components/HighlightRibbon";
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
        "group relative rounded-[18px] transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover",
        result.isHighlighted
          ? "bg-highlight-ring-gradient animate-highlight-glow p-[3px]"
          : "border border-card-border bg-card",
        className
      )}
    >
      <HighlightRibbon isHighlighted={result.isHighlighted} />
      <div className={cn("overflow-hidden bg-card", result.isHighlighted ? "rounded-[15px]" : "rounded-[18px]")}>
        <Link href={`/profile/${result.id}`} className="relative block h-55 w-full overflow-hidden">
          <MemberProfilePhoto
            photoUrl={result.photoUrl}
            // Search only ever returns approved photos for other members (see
            // member-search.repository.ts) — never expose a pending upload.
            approvalStatus={result.photoUrl ? "APPROVED" : null}
            gender={result.gender}
            name={result.name}
            isBlurred={result.photoIsBlurred}
            className="absolute inset-0 h-full w-full"
          />
          {result.match != null && (
            <span className="absolute right-2.5 bottom-2.5 rounded-full bg-primary-deep px-2.5 py-1 text-[11.5px] font-extrabold text-white">
              {result.match}% match
            </span>
          )}
          <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
            <PremiumBadge isPremium={result.isPremium} />
          </div>
        </Link>
        <div className="p-4.5">
          <Link href={`/profile/${result.id}`} className="flex items-center gap-1.5">
            <span className="truncate text-[15.5px] font-extrabold text-primary-deep">
              {result.name}, {result.age}
            </span>
            {result.verified && (
              <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                <svg viewBox="0 0 24 24" className="size-2.5" fill="currentColor">
                  <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                </svg>
              </span>
            )}
          </Link>
          <div className="mt-1 truncate text-[13px] text-muted-foreground">{result.occupation ?? "—"}</div>
          <div className="mt-0.5 truncate text-xs text-faint">
            {result.height ?? "—"} · {result.place || "—"}
            {result.distanceKm != null && ` · ${Math.round(result.distanceKm)} km away`}
          </div>
          <div className="mt-3.5 flex gap-2">
            <InterestButton memberId={result.id} className="flex-1" />
            <ShortlistButton memberId={result.id} />
            <MessageButton memberId={result.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
