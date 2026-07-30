import { Pencil } from "lucide-react";
import type { RegistrationData } from "@/lib/registration/types";

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
  data,
  onEditStep,
}: {
  data: RegistrationData;
  onEditStep: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <ReviewSection
        title="Personal details"
        onEdit={() => onEditStep(0)}
        rows={[
          ["Name", data.fullName],
          ["Gender", data.gender === "female" ? "Female" : "Male"],
          ["Date of birth", data.dob],
          ["Height", data.height],
          ["Marital status", data.maritalStatus],
          ["Religion & caste", `${data.religion} · ${data.caste}`],
          ["Location", `${data.district}, ${data.state}`],
        ]}
      />
      <ReviewSection
        title="Education & career"
        onEdit={() => onEditStep(1)}
        rows={[
          ["Education", data.highestEducation],
          ["Occupation", data.occupation],
          ["Employer", data.employer],
          ["Annual income", data.annualIncome],
        ]}
      />
      <ReviewSection
        title="Family details"
        onEdit={() => onEditStep(2)}
        rows={[
          ["Family type", data.familyType],
          ["Family values", data.familyValues],
          ["Father's occupation", data.fatherOccupation],
          ["Mother's occupation", data.motherOccupation],
        ]}
      />
      <ReviewSection
        title="Horoscope"
        onEdit={() => onEditStep(3)}
        rows={[
          ["Star", data.star],
          ["Dosham", data.dosham],
          ["Birth place", data.birthPlace],
        ]}
      />
      <ReviewSection
        title="Partner preferences"
        onEdit={() => onEditStep(4)}
        rows={[
          ["Age range", `${data.partnerAgeMin} – ${data.partnerAgeMax}`],
          ["Religion", data.partnerReligion],
          ["Education", data.partnerEducation],
        ]}
      />
      <ReviewSection
        title="Photos & verification"
        onEdit={() => onEditStep(5)}
        rows={[
          ["Photos added", `${data.photoCount} of 6`],
          ["ID type", data.idType],
          ["Selfie", data.selfieCaptured ? "Captured" : "Not captured"],
        ]}
      />
    </div>
  );
}
