"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingMatchCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  subtitle: string;
  className?: string;
  delay?: number;
}

/**
 * Entrance is driven by Motion (`whileInView`); the continuous idle float
 * uses the existing `animate-float` CSS keyframe (see globals.css) so it
 * automatically respects `prefers-reduced-motion` the same way the rest of
 * the app's floating cards do.
 */
export function FloatingMatchCard({
  icon: Icon,
  iconClassName,
  title,
  subtitle,
  className,
  delay = 0,
}: FloatingMatchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn(
        "animate-float motion-reduce:animate-none flex items-center gap-2.5 rounded-2xl border border-white/60 bg-white/90 px-3.5 py-2.5 shadow-[0_16px_40px_rgba(127,29,29,0.16)] backdrop-blur-sm",
        className
      )}
      style={{ animationDelay: `${delay + 0.6}s` }}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full bg-peach-bg text-primary",
          iconClassName
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="leading-tight">
        <div className="text-[13px] font-bold text-primary-deep">{title}</div>
        <div className="text-[11px] text-faint">{subtitle}</div>
      </div>
    </motion.div>
  );
}
