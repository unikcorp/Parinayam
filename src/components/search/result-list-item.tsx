import Link from "next/link";
import { cn } from "@/lib/utils";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { InterestButton } from "@/features/interests/components/InterestButton";
import { ShortlistButton } from "@/features/shortlist/components/ShortlistButton";
import { PremiumBadge } from "@/features/membership/components/PremiumBadge";
import { HighlightRibbon } from "@/features/profile-highlight/components/HighlightRibbon";
import type { SearchResult } from "@/types/profile";

export function SearchResultListItem({ result }: { result: SearchResult }) {
  return (
    <div
      className={cn(
        "relative rounded-[18px]",
        result.isHighlighted
          ? "bg-highlight-ring-gradient animate-highlight-glow p-[3px]"
          : "border border-card-border bg-card shadow-[0_4px_16px_rgba(127,29,29,0.05)]"
      )}
    >
      <HighlightRibbon isHighlighted={result.isHighlighted} />
      <div className={cn("flex overflow-hidden bg-card", result.isHighlighted ? "rounded-[15px]" : "rounded-[18px]")}>
        <Link href={`/profile/${result.id}`} className="relative block w-31 shrink-0 overflow-hidden">
          <MemberProfilePhoto
            photoUrl={result.photoUrl}
            approvalStatus={result.photoUrl ? "APPROVED" : null}
            gender={result.gender}
            name={result.name}
            isBlurred={result.photoIsBlurred}
            className="h-39 w-full"
          />
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5">
            <PremiumBadge isPremium={result.isPremium} />
          </div>
        </Link>
        <div className="flex flex-1 flex-col p-3.5">
          <Link href={`/profile/${result.id}`} className="flex items-center gap-1.5">
            <span className="truncate text-[15px] font-extrabold text-primary-deep">
              {result.name}, {result.age}
            </span>
            {result.verified && (
              <span className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                <svg viewBox="0 0 24 24" className="size-2" fill="currentColor">
                  <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                </svg>
              </span>
            )}
          </Link>
          <div className="mt-0.5 truncate text-[12.5px] text-muted-foreground">{result.occupation ?? "—"}</div>
          <div className="mt-0.5 truncate text-[11.5px] text-faint">
            {result.height ?? "—"} · {result.place || "—"}
            {result.distanceKm != null && ` · ${Math.round(result.distanceKm)} km away`}
          </div>
          {result.match != null && (
            <span className="mt-2 inline-flex w-fit items-center rounded-full bg-surface-blue px-2.5 py-1 text-[11px] font-extrabold text-primary">
              {result.match}% match
            </span>
          )}
          <div className="mt-auto flex gap-2 pt-2.5">
            <InterestButton memberId={result.id} className="flex-1" />
            <ShortlistButton memberId={result.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
