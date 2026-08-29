"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMyProfile } from "@/hooks/use-my-profile";
import { SectionSkeleton } from "@/components/shared/loading-skeletons";
import { api, ApiError } from "@/lib/api";

export default function ReportProblemPage() {
  const { data, isLoading, isError } = useMyProfile();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return <SectionSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-sm font-semibold text-destructive">Unable to load your profile.</p>
        <p className="text-sm text-faint">Please try again.</p>
      </div>
    );
  }

  const { member } = data;

  async function handleSubmit() {
    if (message.trim().length < 10) {
      toast.error("Tell us a little more (at least 10 characters).");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/api/contact", {
        fullName: `${member.first_name} ${member.last_name}`.trim(),
        phone: `${member.mobile_country_code} ${member.mobile}`.trim(),
        email: member.email,
        topic: "Website issue",
        message: message.trim(),
      });
      toast.success("Thanks — we've received your report and will follow up soon.");
      setMessage("");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not submit your report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5.5">
      <div>
        <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-primary-deep">Report a problem</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Found a bug, or something on the site isn&apos;t working right? Let us know and our team will look into it.
        </p>
      </div>

      <div className="rounded-2xl border border-card-border bg-card p-5 lg:rounded-[20px] lg:p-7">
        <div className="mb-4.5 grid grid-cols-1 gap-3 rounded-xl bg-surface px-4 py-3.5 text-sm sm:grid-cols-3">
          <div>
            <div className="text-xs text-faint">Name</div>
            <div className="font-semibold text-ink">{`${member.first_name} ${member.last_name}`.trim()}</div>
          </div>
          <div>
            <div className="text-xs text-faint">Mobile</div>
            <div className="font-semibold text-ink">{`${member.mobile_country_code} ${member.mobile}`}</div>
          </div>
          <div>
            <div className="text-xs text-faint">Email</div>
            <div className="font-semibold text-ink">{member.email}</div>
          </div>
        </div>

        <label className="mb-2 block text-[13px] font-bold text-primary-deep">What went wrong?</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Describe the issue you ran into — the more detail, the faster we can fix it."
          className="resize-none rounded-xl text-sm"
        />

        <div className="mt-5 flex items-center gap-3">
          <Button size="cta" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Submit report"}
          </Button>
          <span className="text-xs text-faint">We reply within one working day.</span>
        </div>
      </div>
    </div>
  );
}
