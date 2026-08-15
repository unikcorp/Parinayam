export function HoroscopeCard({
  star,
  dosham,
  birthTimePlace,
  note,
}: {
  star: string;
  dosham: string;
  birthTimePlace: string;
  note?: string | null;
}) {
  const rows: [string, string][] = [
    ["Star (Nakshatra)", star],
    ["Dosham", dosham],
    ["Birth time & place", birthTimePlace],
  ];
  return (
    <div className="rounded-[20px] border border-card-border bg-card p-6">
      <div className="mb-3.5 text-base font-extrabold text-primary-deep">Horoscope</div>
      <div className="flex flex-col gap-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between text-[13.5px]">
            <span className="font-semibold text-faint">{k}</span>
            <span className={`font-bold ${k === "Dosham" ? "text-success" : "text-primary-deep"}`}>
              {v}
            </span>
          </div>
        ))}
        {note && (
          <div className="mt-1 border-t border-[#F3F5F9] pt-2.5 text-[13.5px]">
            <span className="font-semibold text-faint">Note: </span>
            <span className="font-bold text-primary-deep">{note}</span>
          </div>
        )}
      </div>
    </div>
  );
}
