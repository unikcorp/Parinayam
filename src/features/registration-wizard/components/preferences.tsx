"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  FieldGroup,
  SelectField,
  TextareaField,
} from "@/components/forms/form-fields";
import { RangeFilter } from "@/components/shared/range-filter";
import { useFieldVisibility } from "@/hooks/use-field-visibility";
import type { RegistrationFormValues } from "../schema";
import type { RegistrationLookups } from "../use-registration-lookups";
import {
  PARTNER_AGE_MIN_MALE,
  PARTNER_AGE_MIN_FEMALE,
  PARTNER_AGE_MAX,
} from "@/constants/registration";

const heights = ["4' 10\"", "5' 0\"", "5' 2\"", "5' 4\"", "5' 6\"", "5' 8\""];

export function PreferencesStep({ lookups }: { lookups: RegistrationLookups }) {
  const { watch, setValue } = useFormContext<RegistrationFormValues>();
  const { isFieldEnabled } = useFieldVisibility();

  const gender = watch("gender");
  const partnerAgeMin = watch("partnerAgeMin");
  const partnerAgeMax = watch("partnerAgeMax");
  const partnerReligion = watch("partnerReligion");

  // Gender-based lower bound: male members can look for partners from 18,
  // female members from 21 (legal minimum for marriage in India).
  const ageMin = gender === "male" ? PARTNER_AGE_MIN_MALE : PARTNER_AGE_MIN_FEMALE;

  // If the stored partnerAgeMin is below the gender-based floor (e.g. the
  // member changed their gender or an old default was set), snap it up so
  // the slider never shows an invalid starting position.
  useEffect(() => {
    if (partnerAgeMin < ageMin) {
      setValue("partnerAgeMin", ageMin, { shouldValidate: true });
    }
  }, [ageMin, partnerAgeMin, setValue]);

  return (
    <FieldGroup title="">
      <div className="mb-6">
        <RangeFilter
          label="Partner age"
          value={[partnerAgeMin, partnerAgeMax]}
          onChange={([min, max]) => {
            // Never allow the user to drag below the gender floor.
            setValue("partnerAgeMin", Math.max(min, ageMin));
            setValue("partnerAgeMax", max);
          }}
          min={ageMin}
          max={PARTNER_AGE_MAX}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {isFieldEnabled("partnerHeightMin") && (
          <SelectField<RegistrationFormValues> name="partnerHeightMin" label="Minimum height" options={heights} />
        )}
        {isFieldEnabled("partnerReligion") && (
          <SelectField<RegistrationFormValues>
            name="partnerReligion"
            label="Religion"
            options={lookups.religionOptions}
          />
        )}
        {isFieldEnabled("partnerCaste") && (
          <SelectField<RegistrationFormValues>
            name="partnerCaste"
            label="Caste"
            options={lookups.casteOptions(partnerReligion)}
          />
        )}
        {isFieldEnabled("partnerEducation") && (
          <SelectField<RegistrationFormValues>
            name="partnerEducation"
            label="Education"
            options={lookups.educationOptions}
          />
        )}
        {isFieldEnabled("partnerAbout") && (
          <TextareaField<RegistrationFormValues>
            name="partnerAbout"
            label="What matters most to you"
            placeholder="Describe the qualities and values you're looking for…"
            className="sm:col-span-2"
          />
        )}
      </div>
    </FieldGroup>
  );
}
