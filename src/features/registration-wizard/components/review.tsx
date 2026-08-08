"use client";

import { Pencil } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { RegistrationFormValues } from "../schema";

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

export function ReviewStep({ onEditStep }: { onEditStep: (index: number) => void }) {
  const { watch } = useFormContext<RegistrationFormValues>();
  const data = watch();

  return (
    <div className="flex flex-col gap-6">
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
        title="Partner preferences"
        onEdit={() => onEditStep(5)}
        rows={[
          ["Age range", `${data.partnerAgeMin} – ${data.partnerAgeMax}`],
          ["Religion", data.partnerReligion ?? ""],
          ["Education", data.partnerEducation ?? ""],
        ]}
      />
      <ReviewSection
        title="Photos & verification"
        onEdit={() => onEditStep(6)}
        rows={[
          ["Photos added", `${data.photoCount} of 6`],
          ["ID type", data.idType],
          ["ID document", data.idDocumentUploaded ? "Uploaded" : "Not uploaded"],
          ["Selfie", data.selfieCaptured ? "Captured" : "Not captured"],
        ]}
      />
    </div>
  );
}
