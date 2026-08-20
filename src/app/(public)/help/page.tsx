"use client";

import { useState } from "react";
import { MessageCircle, Phone, Mail, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { brand } from "@/data/brand";
import { faqs } from "@/data/faqs.data";
import { useCmsPage } from "@/hooks/use-cms-page";

const channels = [
  { icon: MessageCircle, tint: "bg-surface-blue text-primary", title: "Live chat", desc: "Avg. wait under 2 minutes", cta: "Start chat" },
  { icon: Phone, tint: "bg-success-bg text-success", title: "Call support", desc: `${"1800-425-77-99"} · 9 AM–9 PM`, cta: "Call now" },
  { icon: Mail, tint: "bg-surface-cream-2 text-gold-text", title: "Email us", desc: `${brand.supportEmail} · 4 hr reply`, cta: "Write to us" },
  { icon: "🟢" as const, tint: "bg-success-bg text-success", title: "WhatsApp", desc: "Chat in Malayalam or English", cta: "Open WhatsApp" },
];

export default function HelpCenterPage() {
  const [topic, setTopic] = useState("Billing & refunds");
  const { data: faqPage } = useCmsPage("faq");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <section className="bg-dark-panel-gradient px-5 py-10 text-center text-white lg:px-12 lg:py-14">
        <h1 className="mb-2.5 text-2xl font-extrabold tracking-[-0.01em] lg:text-4xl">
          How can we help?
        </h1>
        <p className="mb-5 text-sm text-white/70 lg:text-[15.5px]">
          Search articles, or reach our Kerala-based support team directly.
        </p>
        <div className="mx-auto flex max-w-155 items-center gap-3 rounded-2xl bg-card p-2 pl-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
          <Search className="size-4.5 shrink-0 text-faint" />
          <span className="flex-1 truncate text-left text-sm text-faint">
            Try &quot;photo privacy&quot; or &quot;refund&quot;…
          </span>
          <Button size="sm" className="shrink-0">
            Search
          </Button>
        </div>
      </section>

      <div className="mx-auto w-full max-w-275 px-5 pt-8 pb-12 lg:px-6 lg:pt-10">
        <div className="mb-9 grid grid-cols-2 gap-3 lg:mb-11 lg:grid-cols-4 lg:gap-4.5">
          {channels.map((ch) => (
            <div
              key={ch.title}
              className="rounded-2xl border border-card-border bg-card p-4 text-center lg:p-6 lg:transition-all lg:duration-200 lg:hover:-translate-y-1 lg:hover:shadow-card-hover"
            >
              <span
                className={`mx-auto mb-2.5 flex size-10 items-center justify-center rounded-xl text-lg lg:mb-3.5 lg:size-12.5 ${ch.tint}`}
              >
                {typeof ch.icon === "string" ? ch.icon : <ch.icon className="size-[18px] lg:size-5" />}
              </span>
              <div className="text-sm font-extrabold text-primary-deep lg:text-[15.5px]">
                {ch.title}
              </div>
              <div className="mt-1 text-[11.5px] text-faint lg:text-[12.5px]">{ch.desc}</div>
              <div className="mt-2 hidden text-[13px] font-bold text-primary lg:block">
                {ch.cta} →
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_380px]">
          <div>
            <h2 className="mb-4 text-lg font-extrabold text-primary-deep lg:text-[22px]">
              {faqPage?.cms_title ?? "Frequently asked questions"}
            </h2>
            {faqPage?.cms_content ? (
              <div
                className="rounded-2xl border border-card-border bg-card p-5 text-[14px] leading-[1.75] text-muted-foreground lg:p-6.5 [&_h1]:mb-2 [&_h1]:font-extrabold [&_h1]:text-primary-deep [&_h2]:mb-2 [&_h2]:font-extrabold [&_h2]:text-primary-deep [&_h3]:mb-1.5 [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:text-primary-deep [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-primary-deep [&_a]:text-primary [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: faqPage.cms_content }}
              />
            ) : (
              <Accordion defaultValue={["faq-0"]} className="flex flex-col gap-2.5">
                {faqs.map((f, i) => (
                  <AccordionItem
                    key={f.q}
                    value={`faq-${i}`}
                    className="overflow-hidden rounded-2xl border border-card-border bg-card"
                  >
                    <AccordionTrigger className="px-5 py-4 text-[15px] font-bold text-primary-deep hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4.5 text-sm leading-[1.65] text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          <aside className="rounded-[20px] border border-card-border bg-card p-6.5 lg:sticky lg:top-6">
            <div className="mb-1.5 text-lg font-extrabold text-primary-deep">Raise a ticket</div>
            <div className="mb-5 text-[13px] text-faint">We reply within 4 working hours.</div>
            <label className="mb-1.75 block text-[12.5px] font-bold text-primary-deep">
              Topic
            </label>
            <Select value={topic} onValueChange={(v) => v && setTopic(v)}>
              <SelectTrigger className="mb-3.5 h-auto w-full rounded-xl px-3.5 py-3 text-sm font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Billing & refunds", "Account & profile", "Verification", "Safety & privacy", "Other"].map(
                  (t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <label className="mb-1.75 block text-[12.5px] font-bold text-primary-deep">
              Describe the issue
            </label>
            <Textarea
              placeholder="Tell us what happened…"
              rows={4}
              className="mb-3.5 resize-none rounded-xl text-sm"
            />
            <div className="mb-4.5 flex items-center gap-2.5 rounded-xl border border-dashed border-input px-3.5 py-3 text-[13px] text-faint">
              📎 Attach screenshot (optional)
            </div>
            <Button size="cta" className="w-full">
              Submit ticket
            </Button>
            <div className="mt-3.5 text-center text-xs text-faint">
              Or call <b className="text-primary-deep">1800-425-77-99</b> (9 AM – 9 PM IST)
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
