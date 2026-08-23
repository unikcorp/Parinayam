"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { brand } from "@/data/brand";
import { whyParinayamFeatures, verifySteps } from "@/data/why-parinayam.data";

export function WhyParinayam() {
  return (
    <section className="bg-primary-deep px-5 py-10 text-white lg:px-18 lg:py-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold-light uppercase lg:mb-3 lg:text-[13px]">
            Why choose us
          </div>
          <h2 className="mb-3 text-[26px] leading-[1.2] font-extrabold tracking-[-0.02em] lg:mb-5 lg:text-4xl lg:leading-[1.15]">
            Matchmaking built on trust, not just algorithms
          </h2>
          <p className="mb-6 text-[14.5px] leading-[1.65] text-white/70 lg:mb-9 lg:text-[17px] lg:leading-[1.7]">
            Every ID and photo is reviewed by our team, and verified members
            carry a badge you can trust. Your photos and contact details stay
            private until you choose to share them.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
            {whyParinayamFeatures.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
                className="group flex items-start gap-3.5"
              >
                <span className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-white/8 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/15 lg:size-10">
                  <w.icon className="size-4.5" />
                </span>
                <div>
                  <div className="text-[15px] font-bold">{w.title}</div>
                  <div className="mt-0.5 text-[13px] leading-[1.5] text-white/70">
                    {w.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="rounded-3xl border border-white/12 bg-white/6 p-5 transition-colors duration-300 hover:bg-white/8 lg:p-10"
        >
          <div className="mb-1.5 flex items-center gap-3 lg:mb-6">
            <span className="animate-pop flex size-10 items-center justify-center rounded-full border-2 border-gold-light bg-primary text-lg lg:size-14">
              <Check className="size-4.5 lg:size-5" />
            </span>
            <div>
              <div className="text-[17px] font-extrabold lg:text-2xl">
                The Verified Badge
              </div>
              <div className="hidden text-sm text-white/70 lg:block">
                What the red tick means on {brand.name}
              </div>
            </div>
          </div>
          <div className="text-[13px] leading-[1.6] text-white/70 lg:hidden">
            Government ID verified · Phone &amp; live selfie confirmed ·
            Reviewed by our Kerala-based team.
          </div>
          <div className="hidden lg:block">
            {verifySteps.map((v) => (
              <div key={v.title} className="flex gap-3.5 border-t border-white/10 py-4 transition-colors duration-200 hover:bg-white/4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success-bg text-xs font-extrabold text-success">
                  <Check className="size-3.5" />
                </span>
                <div>
                  <div className="text-[15px] font-bold">{v.title}</div>
                  <div className="mt-0.5 text-[13px] text-white/70">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
