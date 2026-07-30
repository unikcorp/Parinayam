"use client";

import { ChevronLeft } from "lucide-react";
import { registrationSteps } from "@/lib/registration/types";
import { cn } from "@/lib/utils";

export function MobileStepHeader({
  activeIndex,
  onStepClick,
  onExit,
}: {
  activeIndex: number;
  onStepClick: (i: number) => void;
  onExit: () => void;
}) {
  const percent = Math.round(((activeIndex + 1) / registrationSteps.length) * 100);
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
        <span className="text-success">{percent}%</span>
      </div>
      <div className="h-1.5 bg-[#EDEFF3]">
        <div
          className="bg-progress-success-gradient h-full transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="pn-scroll-x flex gap-2 overflow-x-auto px-5 py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {registrationSteps.map((step, i) => (
          <button
            key={step.key}
            type="button"
            onClick={() => onStepClick(i)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-[12.5px] font-bold whitespace-nowrap",
              i === activeIndex
                ? "bg-primary text-white"
                : "border border-input text-faint"
            )}
          >
            {step.title.split(" ")[0]}
          </button>
        ))}
      </div>
    </header>
  );
}
