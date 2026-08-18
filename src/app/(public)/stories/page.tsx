"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/shared/image-slot";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { successStories } from "@/data/stories.data";

const years = ["All", "2026", "2025", "2024"];
const districts = ["All", "Ernakulam", "Thrissur", "Kozhikode", "Palakkad", "Kottayam", "Kannur"];

export default function SuccessStoriesPage() {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState(years[0]);
  const [district, setDistrict] = useState(districts[0]);

  const filtered = successStories.filter((s) => {
    const matchesQuery = `${s.couple} ${s.place}`.toLowerCase().includes(query.toLowerCase());
    const matchesYear = year === "All" || s.when.includes(year);
    const matchesDistrict = district === "All" || s.place.includes(district);
    return matchesQuery && matchesYear && matchesDistrict;
  });

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface-cream">
      <section className="px-5 pt-9 pb-6 text-center lg:px-12 lg:pt-13 lg:pb-9">
        <div className="mb-2.5 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
          Success stories
        </div>
        <h1 className="mb-2.5 text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep lg:mb-3 lg:text-[44px]">
          3,200 weddings. 3,200 stories.
        </h1>
        <p className="mx-auto mb-6 max-w-140 text-sm text-muted-foreground lg:mb-7 lg:text-[16.5px]">
          Real couples who met on {`Parinayam`}, in their own words.
        </p>
        <div className="mx-auto flex max-w-190 flex-col gap-2.5 lg:flex-row">
          <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-[#F0E4D6] bg-card px-4.5 py-3.5">
            <Search className="size-4 shrink-0 text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by couple name or town…"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
            />
          </div>
          <Select value={year} onValueChange={(v) => v && setYear(v)}>
            <SelectTrigger className="h-auto rounded-2xl border-[#F0E4D6] px-4.5 py-3.5 text-sm font-bold text-primary-deep">
              <span className="text-faint">Year:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={district} onValueChange={(v) => v && setDistrict(v)}>
            <SelectTrigger className="h-auto rounded-2xl border-[#F0E4D6] px-4.5 py-3.5 text-sm font-bold text-primary-deep">
              <span className="text-faint">District:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* FEATURED */}
      <section className="px-5 pb-8 lg:px-12 lg:pb-10">
        <div className="overflow-hidden rounded-[22px] bg-primary-deep text-white lg:grid lg:grid-cols-[560px_1fr]">
          <ImageSlot label="Featured couple — wedding photo" className="h-52.5 w-full lg:h-105" />
          <div className="flex flex-col justify-center p-6 lg:p-13">
            <span className="bg-gold-gradient mb-4 inline-flex w-fit rounded-full px-3.5 py-1.5 text-[11px] font-extrabold tracking-wide uppercase">
              Featured story
            </span>
            <h2 className="mb-1.5 text-2xl font-extrabold tracking-[-0.02em] lg:text-[32px]">
              Meera &amp; Kiran
            </h2>
            <div className="mb-3.5 text-[13.5px] font-bold text-gold-light lg:mb-4.5">
              Married January 2026 · Guruvayur Temple
            </div>
            <p className="mb-5 text-sm leading-[1.7] text-white/70 lg:mb-6 lg:text-base lg:leading-[1.8]">
              &quot;Amma created my profile without telling me. The first match she showed me
              was Kiran — 92% compatible, same district, and our horoscopes matched 9 out of
              10 poruthams. Three months later, his family visited ours. The rest is our
              story.&quot;
            </p>
            <Button variant="outline" className="w-fit border-white/25 bg-white/10 text-white hover:bg-white/18">
              Read their full story →
            </Button>
          </div>
        </div>
      </section>

      {/* STORY GRID */}
      <section className="px-5 pb-12 lg:px-12">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6.5">
          {filtered.map((s) => (
            <div
              key={s.couple}
              className="overflow-hidden rounded-2xl border border-[#F0E9DD] bg-card transition-all duration-200 lg:hover:-translate-y-1.5 lg:hover:shadow-card-hover"
            >
              <div className="relative">
                <ImageSlot label="Couple photo" className="h-45 w-full lg:h-60" />
                <span className="absolute bottom-3 left-3.5 rounded-full bg-white/94 px-3 py-1.5 text-xs font-extrabold text-primary-deep">
                  💍 {s.when}
                </span>
              </div>
              <div className="p-5.5 lg:p-6">
                <div className="text-lg font-extrabold text-primary-deep lg:text-[19px]">
                  {s.couple}
                </div>
                <div className="mt-1 mb-3 text-xs font-bold text-gold">{s.place}</div>
                <p className="text-sm leading-[1.65] text-muted-foreground">&quot;{s.quote}&quot;</p>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-faint">No stories match your search.</p>
        )}
        {filtered.length > 0 && (
          <div className="mt-8 text-center lg:mt-10">
            <Button variant="outline" className="border-gold-light text-gold-text hover:border-gold">
              Load more stories
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
