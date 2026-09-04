import type { ReactNode } from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MemberProfilePhoto } from "@/components/shared/member-profile-photo";
import { InterestButton } from "@/features/interests/components/InterestButton";
import { ShortlistButton } from "@/features/shortlist/components/ShortlistButton";
import { PremiumBadge } from "@/features/membership/components/PremiumBadge";

export interface ProfileCardProps {
  name: string;
  age: number;
  occupation: string;
  location: string;
  photoUrl?: string | null;
  photoIsBlurred?: boolean;
  gender?: "Male" | "Female" | string;
  verified?: boolean;
  premium?: boolean;
  /** Profile Highlight — a paid add-on independent of Membership. */
  highlighted?: boolean;
  online?: boolean;
  matchPercent?: number;
  /** Real member id — when present the Interest/Shortlist buttons actually work. Omit for demo/marketing cards. */
  memberId?: number;
  /** Marketing/logged-out context (e.g. landing page) — the photo, Interest and Shortlist all send the visitor to /login instead of acting for real. Takes priority over memberId. */
  teaser?: boolean;
  className?: string;
  photoClassName?: string;
}

export function ProfileCard({
  name,
  age,
  occupation,
  location,
  photoUrl,
  photoIsBlurred,
  gender = "Male",
  verified,
  premium,
  highlighted,
  online,
  matchPercent,
  memberId,
  teaser,
  className,
  photoClassName,
}: ProfileCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-card-border bg-card shadow-card transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-card-hover",
        className
      )}
    >
      <PremiumBadge isPremium={!!premium} className="animate-pop absolute top-3 left-3 z-10" />

      <CardLink memberId={memberId} teaser={teaser}>
        <div
          className={cn(
            "relative",
            highlighted && "bg-highlight-ring-gradient animate-highlight-glow rounded-t-3xl p-[3px]"
          )}
        >
          <div
            className={cn(
              "relative h-[210px] w-full shrink-0 overflow-hidden",
              highlighted && "rounded-t-[21px]",
              photoClassName
            )}
          >
            <MemberProfilePhoto
              photoUrl={photoUrl ?? null}
              approvalStatus={photoUrl ? "APPROVED" : null}
              isBlurred={photoIsBlurred}
              gender={gender}
              name={name}
              className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110"
            />
            {online && (
              <span className="absolute bottom-3 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-success">
                <span className="size-1.5 rounded-full bg-success" /> Online now
              </span>
            )}
            {typeof matchPercent === "number" && (
              <span className="absolute bottom-3 right-3.5 rounded-full bg-primary-deep px-2.5 py-1 text-[11px] font-extrabold text-white">
                {matchPercent}% match
              </span>
            )}
          </div>
        </div>

        <div className="px-4.5 pt-4">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-base font-extrabold text-primary-deep">
              {name}, {age}
            </span>
            {verified && (
              <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                <svg viewBox="0 0 24 24" className="size-2.5" fill="currentColor">
                  <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                </svg>
              </span>
            )}
          </div>
          <div className="mt-1 truncate text-[13px] text-muted-foreground">
            {occupation} · {location}
          </div>
        </div>
      </CardLink>

      <div className="flex flex-col gap-3.5 px-4.5 pt-3.5 pb-4.5">
        <div className="flex gap-2">
          {teaser ? (
            <Button className="flex-1" size="sm" render={<Link href="/login" />}>
              <Heart className="size-3.5" /> Interest
            </Button>
          ) : memberId != null ? (
            <InterestButton memberId={memberId} className="flex-1" />
          ) : (
            <Button className="flex-1" size="sm" disabled>
              <Heart className="size-3.5" /> Interest
            </Button>
          )}
          {teaser ? (
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Log in to shortlist"
              render={<Link href="/login" />}
            >
              <Star className="size-4" />
            </Button>
          ) : memberId != null ? (
            <ShortlistButton memberId={memberId} />
          ) : (
            <Button variant="outline" size="icon-sm" aria-label="Shortlist" disabled>
              <Star className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function CardLink({
  memberId,
  teaser,
  children,
}: {
  memberId?: number;
  teaser?: boolean;
  children: ReactNode;
}) {
  if (teaser) {
    return (
      <Link href="/login" className="contents">
        {children}
      </Link>
    );
  }
  if (memberId == null) return <>{children}</>;
  return (
    <Link href={`/profile/${memberId}`} className="contents">
      {children}
    </Link>
  );
}
