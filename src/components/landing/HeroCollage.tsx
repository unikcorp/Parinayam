"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import { Heart, Sparkles } from "lucide-react";
import { heroCollageImages } from "@/config/landingImages";
import { FloatingMatchCard } from "@/components/landing/FloatingMatchCard";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const slideFromBottom: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

/**
 * Four-photo hero collage — top-left/top-right/bottom-left/bottom-right,
 * each at a gentle rotation with a white photo-frame border, but with a
 * clear 20-30px gap between every pair so all four photos stay fully
 * visible (no image is cropped by another overlapping it). Decorative
 * accents (hearts, swirl, badge, arrow) are all positioned outside the
 * four photo rectangles so they never sit on top of a photo either.
 */
export function HeroCollage() {
  const reduceMotion = useReducedMotion();
  const v = reduceMotion ? { hidden: {}, show: {} } : undefined;

  // Scroll-linked parallax for the heart badge: as the hero scrolls out of
  // view (from its top hitting the viewport top, to its bottom leaving it),
  // the badge drifts up, rotates and fades — tied to scroll position rather
  // than a one-off on-load animation.
  const collageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: collageRef,
    offset: ["start start", "end start"],
  });
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const badgeRotate = useTransform(scrollYProgress, [0, 1], [0, 30]);

  return (
    <motion.div
      ref={collageRef}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="relative mx-auto w-full max-w-[320px] lg:mx-0 lg:h-[560px] lg:w-[540px] lg:max-w-none"
    >
      {/* ambient glow */}
      <div className="bg-peach-bg absolute inset-10 -z-10 rounded-full opacity-60 blur-3xl" aria-hidden />

      {/* ---------------- Mobile layout ---------------- */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        <motion.div
          variants={v ?? fadeScale}
          className="relative aspect-[3/4] -rotate-2 overflow-hidden rounded-[18px] border-4 border-white shadow-[0_16px_34px_rgba(127,29,29,0.18)]"
        >
          <Image
            src={heroCollageImages.main.small}
            alt={heroCollageImages.main.alt}
            fill
            sizes="150px"
            priority
            unoptimized
            className="object-cover"
          />
        </motion.div>
        <motion.div
          variants={v ?? slideFromRight}
          className="relative mt-6 aspect-[3/4] rotate-2 overflow-hidden rounded-[18px] border-4 border-white shadow-[0_16px_34px_rgba(127,29,29,0.18)]"
        >
          <Image
            src={heroCollageImages.secondary.small}
            alt={heroCollageImages.secondary.alt}
            fill
            sizes="150px"
            unoptimized
            className="object-cover"
          />
        </motion.div>
        <motion.div
          variants={v ?? slideFromBottom}
          className="relative aspect-square -rotate-3 overflow-hidden rounded-[18px] border-4 border-white shadow-[0_14px_28px_rgba(127,29,29,0.16)]"
        >
          <Image
            src={heroCollageImages.gathering.small}
            alt={heroCollageImages.gathering.alt}
            fill
            sizes="150px"
            unoptimized
            className="object-cover"
          />
        </motion.div>
        <motion.div
          variants={v ?? fadeScale}
          className="relative aspect-square rotate-3 overflow-hidden rounded-[18px] border-4 border-white shadow-[0_14px_28px_rgba(127,29,29,0.16)]"
        >
          <Image
            src={heroCollageImages.celebration.small}
            alt={heroCollageImages.celebration.alt}
            fill
            sizes="150px"
            unoptimized
            className="object-cover"
          />
        </motion.div>

        <FloatingMatchCard
          icon={Heart}
          title="New Connections"
          subtitle="Every day"
          delay={0.5}
          className="absolute top-2 -left-3 scale-90"
        />
        <FloatingMatchCard
          icon={Sparkles}
          iconClassName="bg-gold-gradient text-white"
          title="92% Match"
          subtitle="Highly compatible"
          delay={0.7}
          className="absolute -right-3 -bottom-3 scale-90"
        />
      </div>

      {/* ---------------- Desktop layout ---------------- */}
      <div className="hidden lg:block">
        {/* decorative hearts — above-left of the top-left photo */}
        <div className="pointer-events-none absolute top-0 -left-10 z-10" aria-hidden>
          <Heart className="text-primary/30 absolute top-6 left-0 size-3.5 fill-current" />
          <Heart className="text-primary/50 absolute top-0 left-6 size-5 fill-current" />
          <Heart className="text-primary/25 absolute top-14 left-10 size-2.5 fill-current" />
        </div>

        {/* decorative swirl — above the top-right photo */}
        <svg
          viewBox="0 0 40 40"
          className="text-gold/60 pointer-events-none absolute -top-7 right-10 z-10 size-9"
          fill="none"
          aria-hidden
        >
          <path
            d="M6 8c8-4 18 0 16 8s-14 8-14 16c0 5 5 7 9 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* circular heart-glow badge — outside the collage, left of the gap between the two rows */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 1, ease: [0.34, 1.56, 0.64, 1] }}
          style={reduceMotion ? undefined : { y: badgeY, rotate: badgeRotate }}
          className="bg-dark-panel-gradient pointer-events-none absolute top-[253px] left-[245px] z-30 flex size-16 items-center justify-center rounded-full opacity-95 shadow-[0_16px_34px_rgba(127,29,29,0.35)]"
          aria-hidden
        >
          <motion.span
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            className="border-primary/40 absolute inset-[-8px] rounded-full border border-dashed"
          />
          <motion.div
            animate={reduceMotion ? undefined : { scale: [1, 1.18, 1] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="size-6 fill-current text-white" />
          </motion.div>
        </motion.div>

        {/* dotted arc, outside the collage, pointing up toward the match-score card */}
        <svg
          viewBox="0 0 100 100"
          className="text-gold/50 pointer-events-none absolute -right-16 bottom-[150px] z-10 size-12"
          fill="none"
          aria-hidden
        >
          <path
            d="M8 70c10 12 40 18 60 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="1 8"
            strokeLinecap="round"
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0 0 L6 3 L0 6 Z" fill="currentColor" />
            </marker>
          </defs>
        </svg>

        {/* small petals, bottom-left of the collage */}
        <Sparkles
          className="text-primary/30 pointer-events-none absolute bottom-[70px] -left-8 z-10 size-4"
          aria-hidden
        />
        <span
          className="bg-primary/20 pointer-events-none absolute bottom-6 -left-2 z-10 size-3 rotate-45 rounded-sm"
          aria-hidden
        />

        {/* top-left photo */}
        <motion.div
          variants={v ?? fadeScale}
          style={{ rotate: reduceMotion ? 0 : -2 }}
          className="absolute top-0 left-0 z-20 h-[250px] w-[255px] overflow-hidden rounded-[24px] border-8 border-white shadow-[0_24px_50px_rgba(127,29,29,0.2)]"
        >
          <Image
            src={heroCollageImages.main.regular}
            alt={heroCollageImages.main.alt}
            fill
            priority
            sizes="255px"
            unoptimized
            className="object-cover"
          />
        </motion.div>

        {/* top-right photo */}
        <motion.div
          variants={v ?? slideFromRight}
          style={{ rotate: reduceMotion ? 0 : 2 }}
          className="absolute top-[26px] right-0 z-20 h-[290px] w-[255px] overflow-hidden rounded-[24px] border-8 border-white shadow-[0_28px_56px_rgba(127,29,29,0.22)]"
        >
          <Image
            src={heroCollageImages.secondary.regular}
            alt={heroCollageImages.secondary.alt}
            fill
            sizes="255px"
            unoptimized
            className="object-cover"
          />
        </motion.div>

        {/* bottom-left photo */}
        <motion.div
          variants={v ?? slideFromBottom}
          style={{ rotate: reduceMotion ? 0 : -3 }}
          className="absolute top-[280px] left-0 z-20 h-[250px] w-[275px] overflow-hidden rounded-[24px] border-8 border-white shadow-[0_28px_56px_rgba(127,29,29,0.22)]"
        >
          <Image
            src={heroCollageImages.gathering.regular}
            alt={heroCollageImages.gathering.alt}
            fill
            sizes="275px"
            unoptimized
            className="object-cover"
          />
        </motion.div>

        {/* bottom-right photo */}
        <motion.div
          variants={v ?? fadeScale}
          style={{ rotate: reduceMotion ? 0 : 3 }}
          className="absolute right-[22px] bottom-0 z-20 h-[215px] w-[225px] overflow-hidden rounded-[22px] border-8 border-white shadow-[0_22px_46px_rgba(127,29,29,0.22)]"
        >
          <Image
            src={heroCollageImages.celebration.regular}
            alt={heroCollageImages.celebration.alt}
            fill
            sizes="225px"
            unoptimized
            className="object-cover"
          />
        </motion.div>

        <FloatingMatchCard
          icon={Heart}
          title="New Connections"
          subtitle="Every day"
          delay={0.7}
          className="absolute top-14 -left-16 z-50"
        />
        <FloatingMatchCard
          icon={Sparkles}
          iconClassName="bg-gold-gradient text-white"
          title="92% Match"
          subtitle="Highly compatible"
          delay={0.9}
          className="absolute -right-10 bottom-[100px] z-50"
        />
      </div>
    </motion.div>
  );
}
