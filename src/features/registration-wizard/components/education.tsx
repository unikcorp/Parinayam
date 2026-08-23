import { FieldGroup, SelectField, TextField } from "@/components/forms/form-fields";
import { useFieldVisibility } from "@/hooks/use-field-visibility";
import type { RegistrationFormValues } from "../schema";
import type { RegistrationLookups } from "../use-registration-lookups";

export function EducationStep({ lookups }: { lookups: RegistrationLookups }) {
  const { isFieldEnabled } = useFieldVisibility();

  return (
    <FieldGroup title="">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SelectField<RegistrationFormValues>
          name="highestEducation"
          label="Highest education"
          options={lookups.educationOptions}
        />
        {isFieldEnabled("fieldOfStudy") && (
          <TextField<RegistrationFormValues>
            name="fieldOfStudy"
            label="Field of study"
            placeholder="Computer Science"
          />
        )}
        <SelectField<RegistrationFormValues>
          name="occupation"
          label="Occupation"
          options={lookups.occupationOptions}
        />
        {isFieldEnabled("employer") && (
          <TextField<RegistrationFormValues>
            name="employer"
            label="Employer / Organization"
            placeholder="Infopark, Kochi"
          />
        )}
        {isFieldEnabled("annualIncome") && (
          <SelectField<RegistrationFormValues>
            name="annualIncome"
            label="Annual income"
            options={lookups.incomeOptions}
            className="sm:col-span-2"
          />
        )}
      </div>
    </FieldGroup>
  );
}
