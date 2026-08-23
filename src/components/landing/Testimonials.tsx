"use client";

import { Reveal } from "@/components/shared/reveal";
import { useTestimonials } from "@/hooks/use-testimonials";

export function Testimonials() {
  const { data: testimonials } = useTestimonials();
  const items = testimonials ?? [];

  if (items.length === 0) return null;

  return (
    <section className="bg-surface px-5 py-9 lg:px-18 lg:py-24">
      <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-3 lg:gap-6">
        {items.map((t, i) => (
          <Reveal key={t.id ?? t.name} delay={i * 100} className={i === 1 ? "lg:-translate-y-5" : ""}>
            <div className="rounded-2xl border border-card-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover lg:p-7.5">
              <div className="mb-3 text-gold">
                {"★".repeat(t.rating ?? 5)}
                {"☆".repeat(5 - (t.rating ?? 5))}
              </div>
              <p className="mb-5 text-[15px] leading-[1.7] text-foreground/85">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <span className="flex size-10.5 items-center justify-center rounded-full bg-surface-blue text-[15px] font-extrabold text-primary">
                  {t.initials}
                </span>
                <div>
                  <div className="text-sm font-bold text-primary-deep">{t.name}</div>
                  <div className="text-xs text-faint">{t.meta}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
