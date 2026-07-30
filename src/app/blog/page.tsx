"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SimpleHeader } from "@/components/app/simple-header";
import { ImageSlot } from "@/components/parinayam/image-slot";
import { FilterChip } from "@/components/parinayam/filter-chip";

const categories = ["All", "Tradition", "Advice", "Safety", "Weddings", "For parents"];

const sidePosts = [
  { tag: "Advice", title: "The first family meeting: questions worth asking", meta: "4 min read · Dec 2025" },
  { tag: "Safety", title: "How we verify every profile on Parinayam", meta: "3 min read · Dec 2025" },
  { tag: "For parents", title: "Managing your child’s profile — respectfully", meta: "5 min read · Nov 2025" },
];

const posts = [
  { tag: "Weddings", title: "A Guruvayur wedding checklist, from muhurtham to sadhya", excerpt: "Everything Kerala families plan in the 90 days before the big day.", meta: "7 min read · Jan 2026" },
  { tag: "Advice", title: "Writing a profile bio that sounds like you", excerpt: "Skip the clichés. Three prompts that make bios feel human.", meta: "4 min read · Jan 2026" },
  { tag: "Tradition", title: "What the 10 poruthams actually mean", excerpt: "An astrologer explains each compatibility check in plain language.", meta: "8 min read · Dec 2025" },
  { tag: "Safety", title: "Five signs of a suspicious profile", excerpt: "What our trust & safety team looks for — and what you should too.", meta: "3 min read · Dec 2025" },
  { tag: "Advice", title: "Long-distance to lifelong: NRI matches that worked", excerpt: "How three couples bridged time zones before bridging families.", meta: "6 min read · Nov 2025" },
  { tag: "For parents", title: "When to step back: letting your child lead the search", excerpt: "A counsellor on balancing involvement with independence.", meta: "5 min read · Nov 2025" },
];

export default function BlogPage() {
  const [category, setCategory] = useState("All");

  const filteredPosts = posts.filter((p) => category === "All" || p.tag === category);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-card">
      <SimpleHeader
        mobileTitle="Blog"
        right={
          <div className="hidden w-75 items-center gap-2.5 rounded-xl border border-input bg-surface px-4 py-2.75 text-[13.5px] text-faint lg:flex">
            <Search className="size-4" /> Search articles…
          </div>
        }
      />

      <div className="mx-auto w-full max-w-290 px-5 pt-8 pb-12 lg:px-6 lg:pt-11">
        <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
          The {`Parinayam`} Blog
        </div>
        <h1 className="mb-5 text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:mb-6 lg:text-[42px]">
          Advice for your journey
        </h1>

        <div className="mb-7 flex flex-wrap gap-2 lg:mb-9">
          {categories.map((c) => (
            <FilterChip
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              className="px-4.5 py-2.25 text-[13px]"
            >
              {c}
            </FilterChip>
          ))}
        </div>

        {/* FEATURED */}
        <div className="mb-9 grid grid-cols-1 gap-5 lg:mb-11 lg:grid-cols-[1.2fr_1fr] lg:gap-6.5">
          <div className="group relative overflow-hidden rounded-[22px]">
            <ImageSlot label="Featured article image" className="h-65 w-full lg:h-105" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,29,71,0.88)_0%,rgba(15,29,71,0.1)_55%)]" />
            <div className="absolute right-5 bottom-5 left-5 text-white lg:right-8 lg:bottom-7.5 lg:left-8">
              <span className="bg-gold-gradient mb-3 inline-flex rounded-full px-3.25 py-1.5 text-[11px] font-extrabold tracking-wide uppercase lg:mb-3.5">
                Featured
              </span>
              <div className="text-xl font-extrabold tracking-[-0.01em] lg:text-[27px] lg:leading-[1.25]">
                Understanding porutham: a modern guide to horoscope matching
              </div>
              <div className="mt-2 text-xs text-white/75 lg:mt-2.5 lg:text-[13px]">
                Tradition · 6 min read · Jan 2026
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:gap-4.5">
            {sidePosts.map((s) => (
              <div
                key={s.title}
                className="flex items-center gap-4 rounded-2xl border border-card-border bg-card p-3 lg:transition-shadow lg:duration-200 lg:hover:shadow-card-hover"
              >
                <ImageSlot label="img" className="h-19 w-27.5 shrink-0 rounded-xl" />
                <div className="min-w-0">
                  <div className="text-[11.5px] font-bold tracking-wide text-primary uppercase">
                    {s.tag}
                  </div>
                  <div className="mt-1 text-[15.5px] leading-[1.35] font-bold text-primary-deep">
                    {s.title}
                  </div>
                  <div className="mt-1 text-xs text-faint">{s.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="mb-4 text-lg font-extrabold text-primary-deep lg:mb-5 lg:text-[22px]">
          Latest articles
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6.5">
          {filteredPosts.map((p) => (
            <div
              key={p.title}
              className="overflow-hidden rounded-2xl border border-card-border bg-card transition-all duration-200 lg:hover:-translate-y-1.5 lg:hover:shadow-card-hover"
            >
              <ImageSlot label="Article image" className="h-40 w-full lg:h-47.5" />
              <div className="p-5.5">
                <div className="text-xs font-bold tracking-wide text-primary uppercase">
                  {p.tag}
                </div>
                <div className="mt-2 mb-2 text-base leading-[1.35] font-bold text-primary-deep lg:text-[17.5px]">
                  {p.title}
                </div>
                <p className="mb-3 text-[13.5px] leading-[1.6] text-muted-foreground">
                  {p.excerpt}
                </p>
                <div className="text-xs text-faint">{p.meta}</div>
              </div>
            </div>
          ))}
        </div>
        {filteredPosts.length === 0 && (
          <p className="py-16 text-center text-sm text-faint">No articles in this category yet.</p>
        )}
      </div>
    </div>
  );
}
