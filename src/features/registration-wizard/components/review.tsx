"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Pencil } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { RegistrationFormValues } from "../schema";

interface CompletionSummary {
  profile_completion: number;
  mandatory_done: boolean;
  can_enter_dashboard: boolean;
}

function CompletionBanner({ memberId }: { memberId: number | null }) {
  const [summary, setSummary] = useState<CompletionSummary | null>(null);

  useEffect(() => {
    if (memberId == null) return;
    let cancelled = false;
    api
      .get<CompletionSummary>(`/api/members/${memberId}/completion`)
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {
        // Informational banner only — the real gate lives on the dashboard route.
      });
    return () => {
      cancelled = true;
    };
  }, [memberId]);

  if (!summary) return null;

  const ready = summary.can_enter_dashboard;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4.5",
        ready ? "border-success/30 bg-success-bg" : "border-gold/30 bg-peach-bg",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold",
          ready ? "bg-success/15 text-success" : "bg-gold/15 text-gold-text",
        )}
      >
        {ready ? <CheckCircle2 className="size-4.5" /> : `${summary.profile_completion}%`}
      </span>
      <div>
        <div className={cn("text-[14.5px] font-bold", ready ? "text-success" : "text-primary-deep")}>
          {ready ? "Your profile is ready" : `${summary.profile_completion}% complete`}
        </div>
        <p className="mt-0.5 text-[13px] leading-[1.5] text-muted-foreground">
          {ready
            ? "You've hit the dashboard requirements — full access is unlocked."
            : "Complete at least 60% of your profile to unlock the dashboard."}
        </p>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  rows,
}: {
  title: string;
  onEdit: () => void;
  rows: [string, string][];
}) {
  return (
    <div className="border-t border-[#F3F5F9] pt-6 first:border-t-0 first:pt-0">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="text-[15px] font-extrabold text-primary-deep">{title}</div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary"
        >
          <Pencil className="size-3.5" /> Edit
        </button>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 text-sm">
            <span className="text-faint">{label}</span>
            <span className="text-right font-semibold text-ink">
              {value || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewStep({
  onEditStep,
  memberId,
}: {
  onEditStep: (index: number) => void;
  memberId?: number | null;
}) {
  const { watch } = useFormContext<RegistrationFormValues>();
  const data = watch();

  return (
    <div className="flex flex-col gap-6">
      <CompletionBanner memberId={memberId ?? null} />
      <ReviewSection
        title="Account info"
        onEdit={() => onEditStep(0)}
        rows={[
          ["Profile created by", data.profileCreatedBy],
          ["Name", `${data.firstName} ${data.lastName}`.trim()],
          ["Gender", data.gender === "female" ? "Female" : "Male"],
          ["Date of birth", [data.dobDay, data.dobMonth, data.dobYear].filter(Boolean).join(" ")],
          ["Mobile", `${data.mobileCountryCode} ${data.mobileNumber}`.trim()],
          ["Email", data.email],
          ["Religion", data.religion],
          ["Marital status", data.maritalStatus],
        ]}
      />
      <ReviewSection
        title="Personal details"
        onEdit={() => onEditStep(1)}
        rows={[
          ["Height", data.height],
          ["Weight", data.weight],
          ["Body type", data.bodyType],
          ["Complexion", data.complexion],
          ["Physical status", data.physicalStatus],
          ["Blood group", data.bloodGroup],
          ["Mother tongue", data.motherTongue],
          ["Caste", `${data.caste}${data.subCaste ? ` · ${data.subCaste}` : ""}`],
          ["Willing to marry outside caste", data.willingToMarryOtherCaste ? "Yes" : "No"],
          ["Diet", data.diet],
          ["Smoking", data.smokingHabits],
          ["Drinking", data.drinkingHabits],
          ["Location", `${data.district}, ${data.state}`],
        ]}
      />
      <ReviewSection
        title="Education & career"
        onEdit={() => onEditStep(2)}
        rows={[
          ["Education", data.highestEducation],
          ["Occupation", data.occupation],
          ["Employer", data.employer ?? ""],
          ["Annual income", data.annualIncome],
        ]}
      />
      <ReviewSection
        title="Family details"
        onEdit={() => onEditStep(3)}
        rows={[
          ["Family type", data.familyType],
          ["Family values", data.familyValues],
          ["Father's occupation", data.fatherOccupation ?? ""],
          ["Mother's occupation", data.motherOccupation ?? ""],
        ]}
      />
      <ReviewSection
        title="Horoscope"
        onEdit={() => onEditStep(4)}
        rows={[
          ["Star", data.star ?? ""],
          ["Dosham", data.dosham ?? ""],
          ["Birth place", data.birthPlace ?? ""],
        ]}
      />
      <ReviewSection
        title="About you"
        onEdit={() => onEditStep(5)}
        rows={[["About you", data.aboutMe ?? ""]]}
      />
      <ReviewSection
        title="Partner preferences"
        onEdit={() => onEditStep(6)}
        rows={[
          ["Age range", `${data.partnerAgeMin} – ${data.partnerAgeMax}`],
          ["Religion", data.partnerReligion ?? ""],
          ["Education", data.partnerEducation ?? ""],
        ]}
      />
      <ReviewSection
        title="Photos"
        onEdit={() => onEditStep(7)}
        rows={[["Photos added", `${data.photoCount} of 6`]]}
      />
      <ReviewSection
        title="Identity verification"
        onEdit={() => onEditStep(8)}
        rows={[
          ["ID type", data.idType],
          ["ID document", data.idDocumentUploaded ? "Uploaded" : "Not uploaded"],
        ]}
      />
    </div>
  );
}
