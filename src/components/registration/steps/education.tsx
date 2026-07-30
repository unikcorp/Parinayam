import type { RegistrationData } from "@/lib/registration/types";
import { FieldGroup, SelectField, TextField } from "@/components/registration/form-fields";

const educationLevels = [
  "High school",
  "Diploma",
  "Graduate",
  "Postgraduate",
  "Doctorate",
];
const occupations = [
  "Software Engineer",
  "Doctor",
  "Teacher",
  "Business Owner",
  "Government Employee",
  "Bank Employee",
  "Other",
];
const incomeRanges = [
  "Below ₹3 LPA",
  "₹3 – 6 LPA",
  "₹6 – 10 LPA",
  "₹10 – 15 LPA",
  "₹15 – 25 LPA",
  "Above ₹25 LPA",
];

export function EducationStep({
  data,
  update,
}: {
  data: RegistrationData;
  update: <K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) => void;
}) {
  return (
    <FieldGroup title="">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SelectField
          label="Highest education"
          required
          value={data.highestEducation || educationLevels[2]}
          onChange={(v) => update("highestEducation", v)}
          options={educationLevels}
        />
        <TextField
          label="Field of study"
          value={data.fieldOfStudy}
          onChange={(v) => update("fieldOfStudy", v)}
          placeholder="Computer Science"
        />
        <SelectField
          label="Occupation"
          required
          value={data.occupation || occupations[0]}
          onChange={(v) => update("occupation", v)}
          options={occupations}
        />
        <TextField
          label="Employer / Organization"
          value={data.employer}
          onChange={(v) => update("employer", v)}
          placeholder="Infopark, Kochi"
        />
        <SelectField
          label="Annual income"
          required
          value={data.annualIncome || incomeRanges[2]}
          onChange={(v) => update("annualIncome", v)}
          options={incomeRanges}
          className="sm:col-span-2"
        />
      </div>
    </FieldGroup>
  );
}
