"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { SimpleHeader } from "@/components/app/simple-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FilterChip } from "@/components/parinayam/filter-chip";
import { brand } from "@/lib/brand.config";

const topics = ["General enquiry", "Membership", "Partnership", "Press"];

export default function ContactPage() {
  const [topic, setTopic] = useState(topics[0]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <SimpleHeader
        mobileTitle="Contact us"
        right={
          <Button variant="outline" size="sm" className="hidden lg:inline-flex" render={<Link href="/" />}>
            Back to home
          </Button>
        }
      />

      <div className="mx-auto w-full max-w-290 px-5 pt-8 pb-12 lg:px-6 lg:pt-12">
        <div className="mb-8 text-center lg:mb-10">
          <div className="mb-2.5 text-xs font-bold tracking-[0.12em] text-gold uppercase lg:mb-3 lg:text-[13px]">
            Contact us
          </div>
          <h1 className="mb-2 text-2xl font-extrabold tracking-[-0.02em] text-primary-deep lg:mb-3 lg:text-[42px]">
            We&apos;d love to hear from you
          </h1>
          <p className="text-[13.5px] text-muted-foreground lg:text-base">
            <span className="lg:hidden">Our Kochi team replies within one working day.</span>
            <span className="hidden lg:inline">
              Questions, feedback, or a story to share — our Kochi team replies fast.
            </span>
          </p>
        </div>

        {/* mobile quick channels */}
        <div className="mb-5.5 grid grid-cols-2 gap-3 lg:hidden">
          <div className="rounded-2xl border border-success/25 bg-success-bg p-4">
            <div className="mb-2 text-xl">🟢</div>
            <div className="text-[13.5px] font-extrabold text-success">WhatsApp</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">Replies in minutes</div>
          </div>
          <div className="rounded-2xl border border-[#D7DFF0] bg-surface-blue p-4">
            <div className="mb-2 text-xl">📞</div>
            <div className="text-[13.5px] font-extrabold text-primary-deep">1800-425-77-99</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">9 AM – 9 PM IST</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_420px]">
          {/* FORM */}
          <div className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[22px] lg:p-10">
            <div className="mb-4.5 grid grid-cols-1 gap-4.5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] font-bold text-primary-deep">
                  Full name
                </label>
                <Input defaultValue="Radhika Nair" className="h-auto rounded-xl px-4 py-3.5 text-sm" />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-bold text-primary-deep">
                  Phone
                </label>
                <Input
                  defaultValue="+91 98470 22133"
                  className="h-auto rounded-xl px-4 py-3.5 text-sm"
                />
              </div>
            </div>
            <div className="mb-4.5">
              <label className="mb-2 block text-[13px] font-bold text-primary-deep">Email</label>
              <Input
                defaultValue="radhika.n@gmail.com"
                className="h-auto rounded-xl px-4 py-3.5 text-sm"
              />
            </div>
            <div className="mb-4.5">
              <label className="mb-2 block text-[13px] font-bold text-primary-deep">Topic</label>
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => (
                  <FilterChip
                    key={t}
                    active={topic === t}
                    onClick={() => setTopic(t)}
                    className="px-4.5 py-2.25 text-[13px]"
                  >
                    {t}
                  </FilterChip>
                ))}
              </div>
            </div>
            <div className="mb-5.5">
              <label className="mb-2 block text-[13px] font-bold text-primary-deep">
                Message
              </label>
              <Textarea
                defaultValue="I'd like to create a profile for my daughter and had a question about photo privacy…"
                rows={5}
                className="resize-none rounded-xl text-sm"
              />
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button size="cta" className="w-full sm:w-auto">
                Send message →
              </Button>
              <span className="text-xs text-faint">We reply within one working day.</span>
            </div>
          </div>

          {/* MAP + OFFICE */}
          <aside className="flex flex-col gap-4.5">
            <div className="relative h-37.5 overflow-hidden rounded-2xl border border-input bg-[#E8EDF5] lg:h-60 lg:rounded-[20px]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(#D9E2EF 1px, transparent 1px), linear-gradient(90deg, #D9E2EF 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex size-9.5 rotate-[-45deg] items-center justify-center rounded-[50%_50%_50%_0] bg-primary shadow-[0_8px_20px_rgba(185,28,28,0.4)] lg:size-11">
                  <span className="rotate-45 text-sm font-extrabold text-gold-light lg:text-base">
                    P
                  </span>
                </div>
              </div>
              <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-[10px] bg-card px-3.25 py-2 text-[11.5px] font-bold text-primary-deep shadow-[0_5px_14px_rgba(127,29,29,0.12)]">
                <MapPin className="size-3.5" /> Open in Maps
              </span>
            </div>

            <div className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-6.5">
              <div className="mb-2 text-sm font-extrabold text-primary-deep lg:mb-4 lg:text-base">
                Registered office
              </div>
              <div className="text-[13px] leading-[1.7] text-[#4A5568] lg:text-sm">
                {brand.name} Matrimony Pvt. Ltd.
                <br />
                3rd Floor, Trilogy Towers, Kakkanad
                <br />
                Kochi — 682 030, Kerala
              </div>
              <div className="mt-3.5 flex flex-col gap-3 lg:mt-5">
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex size-9 items-center justify-center rounded-[11px] bg-surface-blue text-primary">
                    <Phone className="size-4" />
                  </span>
                  <b className="text-primary-deep">1800-425-77-99</b>
                  <span className="text-xs text-faint">9 AM – 9 PM IST</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex size-9 items-center justify-center rounded-[11px] bg-surface-cream-2 text-gold-text">
                    <Mail className="size-4" />
                  </span>
                  <b className="text-primary-deep">{brand.supportEmail}</b>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-4 rounded-[20px] border border-success/25 bg-success-bg p-5.5 lg:flex">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-success text-xl text-white">
                🟢
              </span>
              <div className="flex-1">
                <div className="text-[15px] font-extrabold text-success">
                  Chat on WhatsApp
                </div>
                <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                  മലയാളം / English · usually replies in minutes
                </div>
              </div>
              <span className="font-extrabold text-success">→</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
