"use client";

import { ChevronLeft } from "lucide-react";
import { registrationSteps } from "@/data/registration/types";
import { cn } from "@/lib/utils";

export function MobileStepHeader({
  activeIndex,
  maxStepReached = Infinity,
  disabledSteps,
  onStepClick,
  onExit,
  percent: percentOverride,
}: {
  activeIndex: number;
  /** Furthest step reached via Next/Skip so far — steps beyond this render non-clickable. Omit to leave every step freely clickable (e.g. editing an already-complete profile). */
  maxStepReached?: number;
  /** Step keys an admin has turned off entirely (Site Settings > Enable/Disable Fields) — hidden from the pill row rather than just non-clickable. */
  disabledSteps?: Set<string>;
  onStepClick: (i: number) => void;
  onExit: () => void;
  /** Real, field-based completion from the backend — falls back to the step-index estimate when not given (e.g. before an account exists yet). */
  percent?: number;
}) {
  const stepEstimate = Math.round((activeIndex / registrationSteps.length) * 100);
  const percent = percentOverride ?? stepEstimate;
  return (
    <header className="sticky top-0 z-10 border-b border-card-border bg-card pt-4 lg:hidden">
      <div className="mb-3.5 flex items-center justify-between px-5">
        <button
          type="button"
          onClick={onExit}
          className="flex size-10 items-center justify-center rounded-[10px] bg-muted text-primary-deep"
        >
          <ChevronLeft className="size-4.5" />
        </button>
        <div className="text-base font-extrabold text-primary-deep">Create profile</div>
        <button type="button" className="text-[13px] font-bold text-faint">
          Save
        </button>
      </div>
      <div className="mb-2 flex justify-between px-5 text-xs font-bold">
        <span className="text-faint uppercase">
          Step {activeIndex + 1} of {registrationSteps.length} ·{" "}
          {registrationSteps[activeIndex].title}
        </span>
        <span className={percent >= 60 ? "text-success" : "text-gold-text"}>{percent}%</span>
      </div>
      <div className="relative h-1.5 bg-[#EDEFF3]">
        <div className="absolute top-0 bottom-0 w-px bg-primary-deep/25" style={{ left: "60%" }} />
        <div
          className={cn(
            "h-full transition-[width] duration-500",
            percent >= 60 ? "bg-progress-success-gradient" : "bg-gold-gradient",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="pn-scroll-x flex gap-2 overflow-x-auto px-5 py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {registrationSteps.map((step, i) => {
          if (disabledSteps?.has(step.key)) return null;
          const clickable = i <= maxStepReached;
          return (
            <button
              key={step.key}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick(i)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-[12.5px] font-bold whitespace-nowrap",
                i === activeIndex
                  ? "bg-primary text-white"
                  : "border border-input text-faint",
                !clickable && "cursor-not-allowed opacity-50"
              )}
            >
              {step.title.split(" ")[0]}
            </button>
          );
        })}
      </div>
    </header>
  );
}
