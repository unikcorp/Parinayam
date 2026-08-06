import { ProgressRing } from "@/components/shared/progress-ring";

export function CompatibilityCard({
  matchPercent,
  porutham,
  lifestyleMatch,
  trustScore,
}: {
  matchPercent: number;
  porutham: string;
  lifestyleMatch: number;
  trustScore: number;
}) {
  return (
    <div className="bg-dark-panel-gradient rounded-[20px] p-6.5 text-center text-white">
      <div className="mx-auto mb-4 w-fit">
        <ProgressRing
          percent={matchPercent}
          size={110}
          strokeWidth={11}
          color="#F5A65C"
          trackColor="rgba(255,255,255,0.15)"
          innerBg="#7F1D1D"
          label={
            <span className="text-2xl font-extrabold text-gold-light">{matchPercent}%</span>
          }
          sublabel="MATCH"
        />
      </div>
      <div className="text-base font-extrabold">Highly compatible with you</div>
      <div className="mt-1.5 text-[13px] leading-[1.6] text-white/70">
        Education, community, lifestyle and horoscope all align strongly.
      </div>
      <div className="mt-4.5 grid grid-cols-3 gap-2">
        <MiniStat value={porutham} label="Porutham" />
        <MiniStat value={`${lifestyleMatch}%`} label="Lifestyle" />
        <MiniStat value={String(trustScore)} label="Trust" />
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[11px] bg-white/8 px-1 py-2.5">
      <div className="text-[15px] font-extrabold text-gold-light">{value}</div>
      <div className="text-[10px] font-bold text-white/70">{label.toUpperCase()}</div>
    </div>
  );
}
