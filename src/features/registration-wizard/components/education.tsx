import { FieldGroup, SelectField, TextField } from "@/components/forms/form-fields";
import type { RegistrationFormValues } from "../schema";

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

export function EducationStep() {
  return (
    <FieldGroup title="">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SelectField<RegistrationFormValues>
          name="highestEducation"
          label="Highest education"
          required
          options={educationLevels}
        />
        <TextField<RegistrationFormValues>
          name="fieldOfStudy"
          label="Field of study"
          placeholder="Computer Science"
        />
        <SelectField<RegistrationFormValues> name="occupation" label="Occupation" required options={occupations} />
        <TextField<RegistrationFormValues>
          name="employer"
          label="Employer / Organization"
          placeholder="Infopark, Kochi"
        />
        <SelectField<RegistrationFormValues>
          name="annualIncome"
          label="Annual income"
          required
          options={incomeRanges}
          className="sm:col-span-2"
        />
      </div>
    </FieldGroup>
  );
}
