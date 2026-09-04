"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { privacyFeatures } from "@/data/privacy-features.data";
import { privacyImage } from "@/config/landingImages";
import { usePrivacyImage, privacyImageUrl } from "@/hooks/use-privacy-image";

export function PrivacySection() {
  // Admin-uploaded image (Site Settings > Home Page Banner) overrides the
  // curated stock photo when set.
  const { data } = usePrivacyImage();
  const imageSrc = privacyImageUrl(data?.image ?? null) ?? privacyImage.regular;

  return (
    <section className="bg-surface-cream px-5 py-9 lg:px-18 lg:py-20">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative order-2 lg:order-1"
        >
          <div className="bg-peach-bg absolute inset-6 -z-10 rounded-full opacity-60 blur-3xl" aria-hidden />
          <div className="relative h-[280px] w-full overflow-hidden rounded-[28px] border-8 border-white shadow-[0_24px_54px_rgba(127,29,29,0.16)] lg:h-[420px]">
            <Image
              src={imageSrc}
              alt={privacyImage.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-6 flex items-center gap-2.5 rounded-2xl bg-card px-4 py-3 shadow-[0_16px_34px_rgba(127,29,29,0.16)]">
            <span className="flex size-9 items-center justify-center rounded-full bg-success-bg text-success">
              <ShieldCheck className="size-4.5" />
            </span>
            <div>
              <div className="text-sm font-bold text-primary-deep">100% Private</div>
              <div className="text-[11px] text-faint">Until you say yes</div>
            </div>
          </div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <div className="mb-2 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
            Privacy &amp; safety
          </div>
          <h2 className="mb-3 text-[26px] leading-[1.2] font-extrabold tracking-[-0.02em] text-primary-deep lg:mb-5 lg:text-4xl lg:leading-[1.15]">
            Your privacy comes first.
          </h2>
          <p className="mb-7 max-w-lg text-[14.5px] leading-[1.65] text-muted-foreground lg:mb-9 lg:text-[17px] lg:leading-[1.7]">
            You control who sees your profile, your photos and your contact
            details — at every step of the way.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
            {privacyFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
                className="group flex items-start gap-3.5 rounded-2xl border border-card-border bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-surface-blue text-primary transition-transform duration-300 group-hover:scale-110">
                  <f.icon className="size-4.5" />
                </span>
                <div>
                  <div className="text-[14px] font-bold text-primary-deep">{f.title}</div>
                  <div className="mt-0.5 text-[12.5px] leading-[1.5] text-muted-foreground">
                    {f.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
