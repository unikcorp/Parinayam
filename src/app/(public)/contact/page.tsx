"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MapPin, Phone, Mail } from "lucide-react";
import { SimpleHeader } from "@/components/layout/simple-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FilterChip } from "@/components/shared/filter-chip";
import { brand } from "@/data/brand";
import { useContactInfo } from "@/hooks/use-contact-info";
import { api, ApiError } from "@/lib/api";
import {
  contactSchema,
  contactTopics,
  contactDefaultValues,
  type ContactFormValues,
} from "@/validation/contact.schema";

function whatsappHref(whatsapp: string): string | null {
  const digits = whatsapp.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export default function ContactPage() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactDefaultValues,
  });

  const { data: contactInfo } = useContactInfo();
  const supportEmail = contactInfo?.supportEmail || brand.supportEmail;
  const waHref = contactInfo?.whatsapp ? whatsappHref(contactInfo.whatsapp) : null;

  async function onSubmit(values: ContactFormValues) {
    try {
      await api.post("/api/contact", values);
      toast.success("Message sent — we'll reply within one working day.");
      reset(contactDefaultValues);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not send your message. Please try again.");
    }
  }

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
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-success/25 bg-success-bg p-4"
            >
              <div className="mb-2 text-xl">🟢</div>
              <div className="text-[13.5px] font-extrabold text-success">WhatsApp</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">Replies in minutes</div>
            </a>
          ) : (
            <div className="rounded-2xl border border-success/25 bg-success-bg p-4 opacity-60">
              <div className="mb-2 text-xl">🟢</div>
              <div className="text-[13.5px] font-extrabold text-success">WhatsApp</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">Coming soon</div>
            </div>
          )}
          {contactInfo?.phone ? (
            <a href={`tel:${contactInfo.phone}`} className="rounded-2xl border border-[#D7DFF0] bg-surface-blue p-4">
              <div className="mb-2 text-xl">📞</div>
              <div className="text-[13.5px] font-extrabold text-primary-deep">{contactInfo.phone}</div>
              {contactInfo.hours && <div className="mt-0.5 text-[11px] text-muted-foreground">{contactInfo.hours}</div>}
            </a>
          ) : (
            <div className="rounded-2xl border border-[#D7DFF0] bg-surface-blue p-4 opacity-60">
              <div className="mb-2 text-xl">📞</div>
              <div className="text-[13.5px] font-extrabold text-primary-deep">Call us</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_420px]">
          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[22px] lg:p-10"
          >
            <div className="mb-4.5 grid grid-cols-1 gap-4.5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] font-bold text-primary-deep">
                  Full name
                </label>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Your name" className="h-auto rounded-xl px-4 py-3.5 text-sm" />
                  )}
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-xs font-semibold text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-bold text-primary-deep">
                  Phone
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="+91 98765 43210" className="h-auto rounded-xl px-4 py-3.5 text-sm" />
                  )}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-xs font-semibold text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-4.5">
              <label className="mb-2 block text-[13px] font-bold text-primary-deep">Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                    className="h-auto rounded-xl px-4 py-3.5 text-sm"
                  />
                )}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-semibold text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4.5">
              <label className="mb-2 block text-[13px] font-bold text-primary-deep">Topic</label>
              <Controller
                name="topic"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {contactTopics.map((t) => (
                      <FilterChip
                        key={t}
                        active={field.value === t}
                        onClick={() => field.onChange(t)}
                        className="px-4.5 py-2.25 text-[13px]"
                      >
                        {t}
                      </FilterChip>
                    ))}
                  </div>
                )}
              />
            </div>
            <div className="mb-5.5">
              <label className="mb-2 block text-[13px] font-bold text-primary-deep">
                Message
              </label>
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="Tell us how we can help…"
                    className="resize-none rounded-xl text-sm"
                  />
                )}
              />
              {errors.message && (
                <p className="mt-1.5 text-xs font-semibold text-destructive">
                  {errors.message.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button size="cta" type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                Send message →
              </Button>
              <span className="text-xs text-faint">We reply within one working day.</span>
            </div>
          </form>

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
              <div className="text-[13px] leading-[1.7] whitespace-pre-line text-[#4A5568] lg:text-sm">
                {brand.name} Matrimony Pvt. Ltd.
                {contactInfo?.address ? `\n${contactInfo.address}` : ""}
              </div>
              <div className="mt-3.5 flex flex-col gap-3 lg:mt-5">
                {contactInfo?.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex size-9 items-center justify-center rounded-[11px] bg-surface-blue text-primary">
                      <Phone className="size-4" />
                    </span>
                    <a href={`tel:${contactInfo.phone}`} className="text-primary-deep font-bold hover:underline">
                      {contactInfo.phone}
                    </a>
                    {contactInfo.hours && <span className="text-xs text-faint">{contactInfo.hours}</span>}
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex size-9 items-center justify-center rounded-[11px] bg-surface-cream-2 text-gold-text">
                    <Mail className="size-4" />
                  </span>
                  <a href={`mailto:${supportEmail}`} className="text-primary-deep font-bold hover:underline">
                    {supportEmail}
                  </a>
                </div>
              </div>
            </div>

            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-4 rounded-[20px] border border-success/25 bg-success-bg p-5.5 lg:flex"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-success text-xl text-white">
                  🟢
                </span>
                <div className="flex-1">
                  <div className="text-[15px] font-extrabold text-success">
                    Chat on WhatsApp
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                    usually replies in minutes
                  </div>
                </div>
                <span className="font-extrabold text-success">→</span>
              </a>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
