import { Check, Heart } from "lucide-react";

export function PartnerMatchList({
  name,
  matches,
}: {
  name: string;
  matches: readonly { label: string; value: string }[];
}) {
  return (
    <div className="rounded-[20px] border border-card-border bg-card p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-9.5 items-center justify-center rounded-[11px] bg-peach-bg text-peach-text">
          <Heart className="size-4" />
        </span>
        <div className="text-lg font-extrabold text-primary-deep">
          {name.split(" ")[0]}&apos;s partner preferences — how you match
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {matches.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3.5 rounded-xl bg-success-bg/60 px-4.5 py-3"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
              <Check className="size-3.5" />
            </span>
            <span className="w-32.5 shrink-0 text-[13.5px] font-semibold text-faint">
              {label}
            </span>
            <span className="text-sm font-bold text-primary-deep">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
