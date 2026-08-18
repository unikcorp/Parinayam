"use client";

import { motion } from "motion/react";
import { AnimatedStat } from "@/components/shared/animated-stat";
import { trustStatistics } from "@/data/landing-stats.data";

export function TrustStats() {
  return (
    <section className="bg-card px-5 py-7 lg:px-18 lg:py-16">
      <div className="grid grid-cols-2 gap-3.5 text-center lg:grid-cols-4 lg:gap-6">
        {trustStatistics.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            className="rounded-2xl bg-surface p-4.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover lg:bg-transparent lg:p-2 lg:hover:bg-surface lg:hover:shadow-card-hover"
          >
            <AnimatedStat
              value={s.value}
              className="text-[27px] font-extrabold tracking-[-0.02em] text-primary tabular-nums lg:text-[44px]"
            />
            <div className="mt-1 text-[12.5px] font-semibold text-faint lg:text-[15px]">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
