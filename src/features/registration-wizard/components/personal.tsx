"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldGroup, SelectField } from "@/components/forms/form-fields";
import type { RegistrationFormValues } from "../schema";
import type { RegistrationLookups } from "../use-registration-lookups";

const heights = ["4' 10\"", "5' 0\"", "5' 2\"", "5' 4\" (163 cm)", "5' 6\"", "5' 8\"", "6' 0\""];
const weights = ["30 Kg", "40 Kg", "50 Kg", "60 Kg", "70 Kg", "80 Kg", "90 Kg", "100+ Kg"];
const bodyTypes = ["Slim", "Athletic", "Average", "Heavy"];
const complexions = ["Very Fair", "Fair", "Wheatish", "Dark"];
const physicalStatuses = ["Normal", "Physically Challenged"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const diets = ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan"];
const smokingOptions = ["No", "Occasionally", "Yes"];
const drinkingOptions = ["No", "Occasionally", "Yes"];

function WillingToMarryOtherCasteField() {
  const { control } = useFormContext<RegistrationFormValues>();
  return (
    <Field label="Willing to marry outside caste?">
      <Controller
        name="willingToMarryOtherCaste"
        control={control}
        render={({ field }) => (
          <label className="flex items-center gap-2.5 py-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="size-4.5 rounded border-input accent-primary"
            />
            Yes, open to other castes
          </label>
        )}
      />
    </Field>
  );
}

export function PersonalStep({ lookups }: { lookups: RegistrationLookups }) {
  const { watch } = useFormContext<RegistrationFormValues>();
  const religion = watch("religion");
  const caste = watch("caste");
  const country = watch("country");
  const state = watch("state");

  return (
    <div className="flex flex-col gap-7">
      <FieldGroup title="">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SelectField<RegistrationFormValues> name="height" label="Height" options={heights} />
          <SelectField<RegistrationFormValues>
            name="motherTongue"
            label="Mother tongue"
            options={lookups.motherTongueOptions}
          />
        </div>
      </FieldGroup>

      <FieldGroup title="Physical attributes">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SelectField<RegistrationFormValues> name="weight" label="Weight" options={weights} />
          <SelectField<RegistrationFormValues> name="bodyType" label="Body type" options={bodyTypes} />
          <SelectField<RegistrationFormValues> name="complexion" label="Complexion" options={complexions} />
          <SelectField<RegistrationFormValues>
            name="physicalStatus"
            label="Physical status"
            options={physicalStatuses}
          />
          <SelectField<RegistrationFormValues> name="bloodGroup" label="Blood group" options={bloodGroups} />
        </div>
      </FieldGroup>

      <FieldGroup title="Community">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SelectField<RegistrationFormValues>
            name="caste"
            label="Caste"
            options={lookups.casteOptions(religion)}
          />
          <SelectField<RegistrationFormValues>
            name="subCaste"
            label="Sub caste"
            options={lookups.subCasteOptions(caste)}
          />
          <WillingToMarryOtherCasteField />
        </div>
      </FieldGroup>

      <FieldGroup title="Lifestyle">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SelectField<RegistrationFormValues> name="diet" label="Diet" options={diets} />
          <SelectField<RegistrationFormValues> name="smokingHabits" label="Smoking" options={smokingOptions} />
          <SelectField<RegistrationFormValues> name="drinkingHabits" label="Drinking" options={drinkingOptions} />
        </div>
      </FieldGroup>

      <FieldGroup title="Location">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <SelectField<RegistrationFormValues>
            name="country"
            label="Country"
            options={lookups.countryOptions}
          />
          <SelectField<RegistrationFormValues>
            name="state"
            label="State"
            options={lookups.stateOptions(country)}
          />
          <SelectField<RegistrationFormValues>
            name="district"
            label="District"
            options={lookups.districtOptions(state)}
          />
        </div>
      </FieldGroup>
    </div>
  );
}
