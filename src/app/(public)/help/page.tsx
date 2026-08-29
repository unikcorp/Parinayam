"use client";

import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { brand } from "@/data/brand";
import { useFaqs } from "@/hooks/use-faqs";
import { AccordionSkeleton } from "@/components/shared/loading-skeletons";

const channels = [
  { icon: Phone, tint: "bg-success-bg text-success", title: "Call support", desc: `${"1800-425-77-99"} · 9 AM–9 PM`, cta: "Call now", href: "tel:+18004257799" },
  { icon: Mail, tint: "bg-surface-cream-2 text-gold-text", title: "Contact us", desc: `${brand.supportEmail} · 4 hr reply`, cta: "Get in touch", href: "/contact" },
];

export default function HelpCenterPage() {
  const { data: faqs, isLoading: isFaqsLoading } = useFaqs();
  const displayedFaqs = faqs ?? [];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <section className="bg-dark-panel-gradient px-5 py-10 text-center text-white lg:px-12 lg:py-14">
        <h1 className="mb-2.5 text-2xl font-extrabold tracking-[-0.01em] lg:text-4xl">
          How can we help?
        </h1>
        <p className="text-sm text-white/70 lg:text-[15.5px]">
          Reach our Kerala-based support team directly.
        </p>
      </section>

      <div className="mx-auto w-full max-w-275 px-5 pt-8 pb-12 lg:px-6 lg:pt-10">
        <div className="mx-auto mb-9 grid max-w-140 grid-cols-2 gap-3 lg:mb-11 lg:gap-4.5">
          {channels.map((ch) => (
            <Link
              key={ch.title}
              href={ch.href}
              className="rounded-2xl border border-card-border bg-card p-4 text-center lg:p-6 lg:transition-all lg:duration-200 lg:hover:-translate-y-1 lg:hover:shadow-card-hover"
            >
              <span
                className={`mx-auto mb-2.5 flex size-10 items-center justify-center rounded-xl text-lg lg:mb-3.5 lg:size-12.5 ${ch.tint}`}
              >
                <ch.icon className="size-[18px] lg:size-5" />
              </span>
              <div className="text-sm font-extrabold text-primary-deep lg:text-[15.5px]">
                {ch.title}
              </div>
              <div className="mt-1 text-[11.5px] text-faint lg:text-[12.5px]">{ch.desc}</div>
              <div className="mt-2 hidden text-[13px] font-bold text-primary lg:block">
                {ch.cta} →
              </div>
            </Link>
          ))}
        </div>

        <div>
          <h2 className="mb-4 text-lg font-extrabold text-primary-deep lg:text-[22px]">
            Frequently asked questions
          </h2>
            {isFaqsLoading ? (
              <AccordionSkeleton />
            ) : displayedFaqs.length === 0 ? (
              <p className="py-10 text-center text-sm text-faint">No FAQs yet — check back soon.</p>
            ) : (
              <Accordion defaultValue={["faq-0"]} className="flex flex-col gap-2.5">
                {displayedFaqs.map((f, i) => (
                  <AccordionItem
                    key={f.faq_id}
                    value={`faq-${i}`}
                    className="overflow-hidden rounded-2xl border border-card-border bg-card"
                  >
                    <AccordionTrigger className="px-5 py-4 text-[15px] font-bold text-primary-deep hover:no-underline">
                      {f.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4.5 text-sm leading-[1.65] text-muted-foreground">
                      {f.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}
