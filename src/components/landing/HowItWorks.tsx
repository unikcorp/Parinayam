"use client";

import { motion } from "motion/react";
import { howItWorksSteps } from "@/data/how-it-works.data";

export function HowItWorks() {
  return (
    <section className="bg-surface px-5 py-9 lg:px-18 lg:py-18">
      <div className="mb-6 lg:mb-13 lg:text-center">
        <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
          How it works
        </div>
        <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep lg:text-4xl">
          Four simple steps to forever
        </h2>
      </div>

      <div className="relative flex flex-col gap-3.5 lg:grid lg:grid-cols-4 lg:gap-6">
        {/* connector line — desktop only */}
        <div
          className="border-card-border absolute top-13 right-[12.5%] left-[12.5%] hidden border-t border-dashed lg:block"
          aria-hidden
        />

        {howItWorksSteps.map((st, i) => (
          <motion.div
            key={st.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
            className="group relative flex items-start gap-4 rounded-2xl border border-card-border bg-card p-4.5 transition-all duration-200 lg:flex-col lg:gap-0 lg:p-7 lg:hover:-translate-y-1.5 lg:hover:shadow-card-hover"
          >
            <span
              className={`relative z-10 flex size-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 lg:mb-5 lg:size-13 ${st.tint}`}
            >
              <st.icon className="size-5 lg:size-6" />
            </span>
            <div>
              <div className="text-[11px] font-bold text-gold lg:text-[13px]">
                STEP {i + 1}
              </div>
              <div className="mt-0.5 mb-1 text-base font-bold text-primary-deep lg:mt-2 lg:mb-2.5 lg:text-xl">
                {st.title}
              </div>
              <div className="text-[13.5px] leading-[1.55] text-muted-foreground lg:text-[15px] lg:leading-[1.6]">
                {st.desc}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
