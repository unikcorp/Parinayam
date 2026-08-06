import { Check } from "lucide-react";
import { brand } from "@/data/brand";
import { registrationSteps } from "@/data/registration/types";
import { cn } from "@/lib/utils";

export function StepperSidebar({ activeIndex }: { activeIndex: number }) {
  return (
    <aside className="bg-dark-panel-gradient hidden flex-col p-11 text-white lg:flex">
      <div className="mb-12 flex items-center gap-3">
        <span className="flex size-9.5 items-center justify-center rounded-[11px] bg-white/12 text-lg font-extrabold text-gold-light">
          {brand.logoLetter}
        </span>
        <span className="text-lg font-extrabold">{brand.name}</span>
      </div>

      <div className="mb-2 text-2xl font-extrabold tracking-[-0.01em]">
        Create your profile
      </div>
      <div className="mb-10 text-sm text-white/70">
        Takes about 8 minutes. Save and resume anytime.
      </div>

      <div className="flex flex-1 flex-col">
        {registrationSteps.map((step, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <div key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex size-8.5 shrink-0 items-center justify-center rounded-full text-[13.5px] font-extrabold",
                    done && "bg-success text-white",
                    active && "bg-card text-primary",
                    !done && !active && "border border-white/25 text-white/60"
                  )}
                >
                  {done ? <Check className="size-4" /> : i + 1}
                </div>
                {i < registrationSteps.length - 1 && (
                  <div className="my-1 min-h-4.5 w-0.5 flex-1 bg-white/15" />
                )}
              </div>
              <div className="pt-1.5 pb-5">
                <div
                  className={cn(
                    "text-[15px] font-bold",
                    active ? "text-white" : done ? "text-white/70" : "text-white/50"
                  )}
                >
                  {step.title}
                </div>
                {active && (
                  <div className="mt-0.5 text-[12.5px] text-white/70">{step.sub}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-white/8 px-4.5 py-4">
        <span className="text-lg">🔒</span>
        <span className="text-[12.5px] leading-[1.55] text-white/70">
          Your details are private until you complete verification and choose
          what to share.
        </span>
      </div>
    </aside>
  );
}
