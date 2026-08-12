"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlanCard, type PlanFeatureRow } from "@/components/shared/plan-card";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

export interface CarouselPlan {
  plan_id: number;
  plan_name: string;
  plan_amount: string;
  plan_duration: number;
  plan_contacts: number;
  profile: number;
  plan_msg: number;
  chat: boolean;
  video: boolean;
}

function planFeatures(plan: CarouselPlan): PlanFeatureRow[] {
  return [
    { label: `${plan.plan_contacts} contact views`, included: plan.plan_contacts > 0 },
    { label: `${plan.profile} profile views`, included: plan.profile > 0 },
    { label: `${plan.plan_msg} messages`, included: plan.plan_msg > 0 },
    { label: "In-app chat", included: !!plan.chat },
    { label: "Video calling", included: !!plan.video },
  ];
}

export function PlansCarousel({ plans }: { plans: CarouselPlan[] }) {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const mostExpensive = plans.reduce<CarouselPlan | null>(
    (max, p) => (Number(p.plan_amount) > Number(max?.plan_amount ?? -1) ? p : max),
    null
  );

  function updateEdges() {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans.length]);

  function scrollByCard(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-plan-card]");
    const amount = (card?.offsetWidth ?? 340) + 28;
    el.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* edge fade masks — hint that there's more to scroll. Start below the
          badge zone (top-9) so they don't slice through the "Most popular"
          badge on the highlighted card. */}
      <div className="pointer-events-none absolute inset-y-0 top-9 left-0 z-10 w-10 bg-gradient-to-r from-card to-transparent lg:w-20" />
      <div className="pointer-events-none absolute inset-y-0 top-9 right-0 z-10 w-10 bg-gradient-to-l from-card to-transparent lg:w-20" />

      <div
        ref={trackRef}
        className="snap-x snap-mandatory flex gap-7 overflow-x-auto scroll-smooth px-5 pt-9 pb-4 [scrollbar-width:none] lg:gap-8 lg:px-18 [&::-webkit-scrollbar]:hidden"
      >
        {plans.map((plan, i) => {
          const isFree = Number(plan.plan_amount) === 0;
          const isBestValue = plan.plan_id === mostExpensive?.plan_id && !isFree;
          return (
            <Reveal key={plan.plan_id} delay={i * 100} className="w-[300px] shrink-0 snap-center sm:w-[340px]">
              <div data-plan-card className="h-full">
                <PlanCard
                  name={plan.plan_name}
                  price={isFree ? "₹0" : `₹${Number(plan.plan_amount).toLocaleString("en-IN")}`}
                  period={isFree ? "forever" : `/ ${plan.plan_duration} days`}
                  badge={isBestValue ? "Most popular" : undefined}
                  dark={isBestValue}
                  ctaLabel={isFree ? "Get started" : `Go ${plan.plan_name}`}
                  onSelect={isFree ? undefined : () => router.push("/checkout")}
                  className={cn("h-full", !isBestValue && !isFree && "border-gold-light")}
                  features={planFeatures(plan)}
                />
              </div>
            </Reveal>
          );
        })}
        {/* trailing spacer so the last card can snap fully into view past the arrow/fade */}
        <div className="w-1 shrink-0 lg:w-4" aria-hidden />
      </div>

      {/* desktop scroll arrows */}
      <button
        type="button"
        aria-label="Scroll plans left"
        onClick={() => scrollByCard(-1)}
        disabled={!canScrollLeft}
        className={cn(
          "absolute top-[calc(50%+18px)] left-1 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-card-border bg-card shadow-card-hover transition-opacity lg:flex",
          !canScrollLeft && "pointer-events-none opacity-0"
        )}
      >
        <ChevronLeft className="size-5 text-primary-deep" />
      </button>
      <button
        type="button"
        aria-label="Scroll plans right"
        onClick={() => scrollByCard(1)}
        disabled={!canScrollRight}
        className={cn(
          "absolute top-[calc(50%+18px)] right-1 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-card-border bg-card shadow-card-hover transition-opacity lg:flex",
          !canScrollRight && "pointer-events-none opacity-0"
        )}
      >
        <ChevronRight className="size-5 text-primary-deep" />
      </button>
    </div>
  );
}
