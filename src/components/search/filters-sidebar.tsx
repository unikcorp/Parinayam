"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RangeFilter } from "@/components/parinayam/range-filter";
import { FilterChip } from "@/components/parinayam/filter-chip";

const selectFields: { label: string; options: string[] }[] = [
  { label: "Religion", options: ["Hindu", "Christian", "Muslim", "Any"] },
  { label: "Caste / Sub caste", options: ["Nair · Veluthedathu", "Nair · Any", "Any"] },
  { label: "Education", options: ["Postgraduate & above", "Graduate & above", "Any"] },
  { label: "Occupation", options: ["Any profession", "Government", "Private", "Business"] },
  { label: "Annual income", options: ["₹6L – ₹20L", "Below ₹6L", "Above ₹20L", "Any"] },
  { label: "Location", options: ["Kerala · Ernakulam", "Kerala · All districts", "Any"] },
  { label: "Marital status", options: ["Never married", "Divorced", "Widowed", "Any"] },
  { label: "Family type", options: ["Any", "Nuclear family", "Joint family"] },
];

const horoscopeChips = ["No dosham", "Any star", "9+ porutham"];
const lifestyleChips = ["Non-smoker", "Vegetarian", "Nuclear family"];

export function FiltersSidebar({ onApply, className }: { onApply?: () => void; className?: string }) {
  const [age, setAge] = useState<[number, number]>([26, 34]);
  const [heightRange, setHeightRange] = useState<[number, number]>([66, 73]);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(selectFields.map((f) => [f.label, f.options[0]]))
  );
  const [activeHoroscope, setActiveHoroscope] = useState(new Set(["No dosham"]));
  const [activeLifestyle, setActiveLifestyle] = useState(new Set(["Non-smoker"]));

  function toggle(set: Set<string>, setSet: (s: Set<string>) => void, item: string) {
    const next = new Set(set);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setSet(next);
  }

  return (
    <aside className={className}>
      <div className="mb-5 flex items-center justify-between">
        <div className="text-[17px] font-extrabold text-primary-deep">Filters</div>
        <button
          type="button"
          className="text-[13px] font-bold text-primary"
          onClick={() => {
            setAge([26, 34]);
            setHeightRange([66, 73]);
            setActiveHoroscope(new Set());
            setActiveLifestyle(new Set());
          }}
        >
          Reset all
        </button>
      </div>

      <div className="mb-5.5">
        <RangeFilter label="Age range" value={age} onChange={setAge} min={18} max={60} />
      </div>
      <div className="mb-5.5">
        <RangeFilter
          label="Height (in)"
          value={heightRange}
          onChange={setHeightRange}
          min={54}
          max={78}
        />
      </div>

      <div className="flex flex-col gap-4">
        {selectFields.map((f) => (
          <div key={f.label}>
            <label className="mb-2 block text-[13px] font-bold text-primary-deep">
              {f.label}
            </label>
            <Select
              value={values[f.label]}
              onValueChange={(v) => v && setValues((s) => ({ ...s, [f.label]: v }))}
            >
              <SelectTrigger className="h-auto w-full rounded-xl px-3.5 py-3 text-sm font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {f.options.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="mt-5 mb-4">
        <div className="mb-2.5 text-[13px] font-bold text-primary-deep">Horoscope</div>
        <div className="flex flex-wrap gap-2">
          {horoscopeChips.map((c) => (
            <FilterChip
              key={c}
              active={activeHoroscope.has(c)}
              onClick={() => toggle(activeHoroscope, setActiveHoroscope, c)}
              onRemove={() => toggle(activeHoroscope, setActiveHoroscope, c)}
              className="px-4 py-2 text-[12.5px]"
            >
              {c}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2.5 text-[13px] font-bold text-primary-deep">Lifestyle</div>
        <div className="flex flex-wrap gap-2">
          {lifestyleChips.map((c) => (
            <FilterChip
              key={c}
              active={activeLifestyle.has(c)}
              onClick={() => toggle(activeLifestyle, setActiveLifestyle, c)}
              onRemove={() => toggle(activeLifestyle, setActiveLifestyle, c)}
              className="px-4 py-2 text-[12.5px]"
            >
              {c}
            </FilterChip>
          ))}
        </div>
      </div>

      <Button size="cta" className="w-full" onClick={onApply}>
        Apply filters
      </Button>
    </aside>
  );
}
