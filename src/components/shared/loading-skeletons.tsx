import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** A block of paragraph-like lines — legal pages, generic text content. */
export function TextBlockSkeleton({ lines = 6, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn("h-4", i % 3 === 2 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

/** A single profile photo card — search grid, dashboard suggested matches, recently viewed. */
export function ProfileCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-card-border bg-card">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="space-y-2 p-3.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function ProfileCardGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4", className)}>
      {Array.from({ length: count }, (_, i) => (
        <ProfileCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** A single row — interests, who-viewed-me, shortlist, blocked members. */
export function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-card-border bg-card p-3.5">
      <Skeleton className="size-14 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
    </div>
  );
}

export function ListRowsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: count }, (_, i) => (
        <ListRowSkeleton key={i} />
      ))}
    </div>
  );
}

/** Full profile detail page — photo + name/meta + a grid of fact fields. */
export function ProfileDetailSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-64 w-full rounded-2xl lg:h-96" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Wide image card with a few text lines below — success stories. */
export function MediaCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-card-border bg-card">
      <Skeleton className="h-45 w-full rounded-none lg:h-60" />
      <div className="space-y-2 p-5.5 lg:p-6">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

export function MediaCardGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6.5", className)}>
      {Array.from({ length: count }, (_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Membership plan cards — plans page, billing page. */
export function PlanCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-card-border bg-card p-6">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

/** Form-field-shaped bars — registration steps, settings forms. */
export function FormSkeleton({ fields = 4, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn("space-y-5", className)}>
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

/** Collapsed accordion rows — FAQ list. */
export function AccordionSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-2xl" />
      ))}
    </div>
  );
}

/** Generic content-block loader — checkout, boost, small sections. */
export function SectionSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  );
}

/** Whole-app-shell loader — shown before any layout chrome mounts (auth gate). */
export function AppShellSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between border-b border-card-border px-5 py-4 lg:px-12">
        <Skeleton className="h-9 w-32 rounded-xl" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <div className="mx-auto w-full max-w-215 flex-1 space-y-5 px-5 py-8 lg:px-6">
        <Skeleton className="h-8 w-1/3" />
        <ProfileCardGridSkeleton count={4} />
      </div>
    </div>
  );
}
