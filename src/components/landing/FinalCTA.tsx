"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="px-5 pb-9 lg:px-18 lg:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[28px] bg-primary-deep px-6 py-14 text-center text-white lg:px-10 lg:py-20"
      >
        <div
          className="bg-gold-gradient absolute -top-24 -right-24 size-72 rounded-full opacity-20 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-24 -left-24 size-72 rounded-full bg-white/10 opacity-40 blur-3xl"
          aria-hidden
        />
        <Heart className="absolute top-8 left-10 hidden size-6 text-white/15 fill-current lg:block" aria-hidden />
        <Sparkles className="absolute right-12 bottom-10 hidden size-6 text-gold-light/40 lg:block" aria-hidden />

        <h2 className="relative mx-auto max-w-xl text-[28px] leading-[1.15] font-extrabold tracking-[-0.02em] lg:text-[42px]">
          Your story could begin here.
        </h2>
        <p className="relative mx-auto mt-3 max-w-md text-[14.5px] leading-[1.6] text-white/70 lg:mt-4 lg:text-[17px] lg:leading-[1.7]">
          Meet someone who shares your values, dreams, and vision for life.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:mt-10">
          <Button size="cta" variant="gold" className="w-full sm:w-auto" render={<Link href="/register" />}>
            Register Free
          </Button>
          <Button
            size="cta"
            variant="outline"
            className="w-full border-white/30 bg-white/10 text-white hover:border-white/60 sm:w-auto"
            render={<Link href="/search" />}
          >
            Explore Profiles
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
