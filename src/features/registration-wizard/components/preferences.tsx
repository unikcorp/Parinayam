"use client";

import { useFormContext } from "react-hook-form";
import {
  FieldGroup,
  SelectField,
  TextareaField,
} from "@/components/forms/form-fields";
import { RangeFilter } from "@/components/shared/range-filter";
import type { RegistrationFormValues } from "../schema";
import type { RegistrationLookups } from "../use-registration-lookups";
import { PARTNER_AGE_MIN, PARTNER_AGE_MAX } from "@/constants/registration";

const heights = ["4' 10\"", "5' 0\"", "5' 2\"", "5' 4\"", "5' 6\"", "5' 8\""];

export function PreferencesStep({ lookups }: { lookups: RegistrationLookups }) {
  const { watch, setValue } = useFormContext<RegistrationFormValues>();
  const partnerAgeMin = watch("partnerAgeMin");
  const partnerAgeMax = watch("partnerAgeMax");
  const partnerReligion = watch("partnerReligion");

  return (
    <FieldGroup title="">
      <div className="mb-6">
        <RangeFilter
          label="Partner age"
          value={[partnerAgeMin, partnerAgeMax]}
          onChange={([min, max]) => {
            setValue("partnerAgeMin", min);
            setValue("partnerAgeMax", max);
          }}
          min={PARTNER_AGE_MIN}
          max={PARTNER_AGE_MAX}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SelectField<RegistrationFormValues> name="partnerHeightMin" label="Minimum height" options={heights} />
        <SelectField<RegistrationFormValues>
          name="partnerReligion"
          label="Religion"
          options={lookups.religionOptions}
        />
        <SelectField<RegistrationFormValues>
          name="partnerCaste"
          label="Caste"
          options={lookups.casteOptions(partnerReligion)}
        />
        <SelectField<RegistrationFormValues>
          name="partnerEducation"
          label="Education"
          options={lookups.educationOptions}
        />
        <TextareaField<RegistrationFormValues>
          name="partnerAbout"
          label="What matters most to you"
          placeholder="Describe the qualities and values you're looking for…"
          className="sm:col-span-2"
        />
      </div>
    </FieldGroup>
  );
}
