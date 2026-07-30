import { ImageSlot } from "@/components/parinayam/image-slot";

export function MutualConnectionsCard({ count }: { count: number }) {
  return (
    <div className="rounded-[20px] border border-card-border bg-card p-6">
      <div className="mb-3.5 text-base font-extrabold text-primary-deep">
        Mutual connections
      </div>
      <div className="flex items-center gap-3">
        <div className="flex">
          {[0, 1, 2].map((i) => (
            <ImageSlot
              key={i}
              label="p"
              className={`size-10 rounded-full border-[2.5px] border-white ${i > 0 ? "-ml-3" : ""}`}
            />
          ))}
        </div>
        <div className="text-[13px] leading-[1.5] text-muted-foreground">
          <b className="text-primary-deep">{count} families</b> you know are
          connected to his family
        </div>
      </div>
    </div>
  );
}

export function HoroscopeCard({
  star,
  rasi,
  dosham,
  birthTimePlace,
  porutham,
}: {
  star: string;
  rasi: string;
  dosham: string;
  birthTimePlace: string;
  porutham: string;
}) {
  const rows: [string, string][] = [
    ["Star (Nakshatra)", star],
    ["Rasi", rasi],
    ["Dosham", dosham],
    ["Birth time & place", birthTimePlace],
  ];
  return (
    <div className="rounded-[20px] border border-card-border bg-card p-6">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="text-base font-extrabold text-primary-deep">Horoscope</div>
        <span className="rounded-full bg-surface-cream-2 px-2.5 py-1 text-[11px] font-extrabold text-gold-text">
          ⭐ {porutham} porutham
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between text-[13.5px]">
            <span className="font-semibold text-faint">{k}</span>
            <span className={`font-bold ${k === "Dosham" ? "text-success" : "text-primary-deep"}`}>
              {v}
            </span>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full rounded-[11px] bg-surface-cream-2 py-3 text-[13.5px] font-bold text-gold-text">
        View full match report →
      </button>
    </div>
  );
}

export function SimilarProfilesRail({
  profiles,
}: {
  profiles: readonly { name: string; meta: string; match: number }[];
}) {
  return (
    <div>
      <div className="mb-3 text-base font-extrabold text-primary-deep">Similar profiles</div>
      <div className="pn-scroll-x flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {profiles.map((p) => (
          <div
            key={p.name}
            className="w-37.5 shrink-0 rounded-2xl border border-card-border bg-card p-3.5 text-center"
          >
            <ImageSlot label="p" className="mx-auto mb-2.25 size-14.5 rounded-full" />
            <div className="truncate text-[13px] font-extrabold text-primary-deep">{p.name}</div>
            <div className="mt-0.5 truncate text-[11px] text-faint">{p.meta}</div>
            <span className="mt-2 inline-block rounded-full bg-surface-blue px-2.5 py-1 text-[10.5px] font-extrabold text-primary">
              {p.match}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SimilarProfilesList({
  profiles,
}: {
  profiles: readonly { name: string; meta: string; match: number }[];
}) {
  return (
    <div className="rounded-[20px] border border-card-border bg-card p-6">
      <div className="mb-3.5 text-base font-extrabold text-primary-deep">
        Similar profiles
      </div>
      <div className="flex flex-col">
        {profiles.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-3.5 border-t border-[#F3F5F9] py-2.75 first:border-t-0 first:pt-0"
          >
            <ImageSlot label="p" className="size-12 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-extrabold text-primary-deep">{p.name}</div>
              <div className="mt-0.5 truncate text-xs text-faint">{p.meta}</div>
            </div>
            <span className="rounded-full bg-surface-blue px-2.5 py-1 text-[11px] font-extrabold text-primary">
              {p.match}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
