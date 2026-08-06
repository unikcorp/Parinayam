"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** ms delay applied once the element scrolls into view — use to stagger a list */
  delay?: number;
  /** direction the content travels in from */
  from?: "bottom" | "left" | "right" | "none";
};

export function Reveal({ children, className, delay = 0, from = "bottom" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const travel =
    from === "bottom" ? "slide-in-from-bottom-6" : from === "left" ? "slide-in-from-left-6" : from === "right" ? "slide-in-from-right-6" : "";

  return (
    <div
      ref={ref}
      className={cn(
        "motion-reduce:animate-none",
        visible ? cn("animate-in fade-in fill-mode-both duration-700 ease-out", travel) : "opacity-0",
        className
      )}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
