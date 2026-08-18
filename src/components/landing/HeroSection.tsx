"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { Check, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCollage } from "@/components/landing/HeroCollage";
import { brand } from "@/data/brand";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const trustIndicators = [
  { icon: Check, tint: "bg-success-bg text-success", label: "100% verified profiles" },
  { icon: Lock, tint: "bg-surface-blue text-primary", label: "Privacy protected" },
  { icon: ShieldCheck, tint: "bg-peach-bg text-primary", label: "Secure & trusted" },
];

export function HeroSection() {
  return (
    <section className="bg-hero-gradient relative overflow-hidden px-5 pt-8 pb-8 lg:px-18 lg:pt-18 lg:pb-0">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"
      >
        <div className="lg:pb-18">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-[#F0E4D6] bg-card px-3.5 py-2 text-xs font-semibold text-gold-text lg:px-4 lg:text-[13px]"
          >
            <span className="size-2 animate-pulse rounded-full bg-gold" />
            Trusted by the {brand.community} community of Kerala
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-4.5 text-[36px] leading-[1.12] font-extrabold tracking-[-0.02em] text-primary-deep lg:mt-6 lg:text-[60px] lg:leading-[1.08] lg:tracking-[-0.025em]"
          >
            Where families meet, and life stories begin.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-3 max-w-xl text-[15.5px] leading-[1.6] text-muted-foreground lg:mt-5 lg:text-[19px] lg:leading-[1.65]"
          >
            Verified profiles, family-first matchmaking, and complete
            privacy — a premium matrimony experience designed for every
            generation.
          </motion.p>

          <motion.div variants={item} className="mt-6 hidden items-center gap-3.5 lg:flex">
            <Button size="cta" render={<Link href="/register" />}>
              Register Free
            </Button>
            <Button
              variant="outline"
              size="cta"
              className="border-[#E3D5C2] bg-white/70"
              render={<Link href="/login" />}
            >
              Login
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] font-semibold text-muted-foreground lg:mt-9 lg:text-sm"
          >
            {trustIndicators.map((t) => (
              <span key={t.label} className="inline-flex items-center gap-2">
                <span className={`inline-flex size-5 items-center justify-center rounded-full ${t.tint}`}>
                  <t.icon className="size-3" />
                </span>
                {t.label}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={item}
          className="relative flex justify-center lg:justify-end lg:self-end lg:pb-10"
        >
          <HeroCollage />
        </motion.div>
      </motion.div>

      {/* mobile CTAs */}
      <div className="mt-6 flex flex-col gap-2.5 lg:hidden">
        <Button size="cta" className="w-full" render={<Link href="/register" />}>
          Register Free
        </Button>
        <Button
          variant="outline"
          size="cta"
          className="w-full border-[#E3D5C2] bg-white/70"
          render={<Link href="/login" />}
        >
          Login
        </Button>
      </div>
    </section>
  );
}
