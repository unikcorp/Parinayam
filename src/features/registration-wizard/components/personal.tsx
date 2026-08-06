"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  ChipGroup,
  Field,
  FieldGroup,
  SelectField,
  TextField,
} from "@/components/forms/form-fields";
import type { RegistrationFormValues } from "../schema";
import { cn } from "@/lib/utils";

const heights = ["4' 10\"", "5' 0\"", "5' 2\"", "5' 4\" (163 cm)", "5' 6\"", "5' 8\"", "6' 0\""];
const maritalStatuses = ["Never married", "Divorced", "Widowed", "Awaiting divorce"];
const languages = ["Malayalam", "Tamil", "Kannada", "Telugu", "Hindi", "English"];
const religions = ["Hindu", "Christian", "Muslim", "Other"];
const castes = ["Nair", "Ezhava", "Iyer", "Menon", "Other"];
const subCastes = ["Veluthedathu Nair", "Illam", "Other"];
const states = ["Kerala", "Tamil Nadu", "Karnataka"];
const districts = ["Ernakulam", "Thrissur", "Kozhikode", "Thiruvananthapuram", "Kottayam"];

function GenderField() {
  const { control } = useFormContext<RegistrationFormValues>();
  return (
    <Field label="Gender" required>
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <div className="flex overflow-hidden rounded-xl border border-input">
            {(["female", "male"] as const).map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => field.onChange(o)}
                className={cn(
                  "flex-1 py-3.5 text-sm font-bold",
                  field.value === o
                    ? "bg-surface-blue text-primary"
                    : "bg-card text-muted-foreground"
                )}
              >
                {o === "female" ? "Female" : "Male"}
              </button>
            ))}
          </div>
        )}
      />
    </Field>
  );
}

export function PersonalStep() {
  return (
    <div className="flex flex-col gap-7">
      <FieldGroup title="">
        <ChipGroup<RegistrationFormValues>
          name="profileFor"
          label="Profile created for"
          required
          options={["Myself", "My daughter", "My son", "Sibling", "Relative"]}
          className="mb-7"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField<RegistrationFormValues>
            name="fullName"
            label="Full name"
            required
            placeholder="Anjali Menon"
          />
          <GenderField />
          <TextField<RegistrationFormValues> name="dob" label="Date of birth" required type="date" />
          <SelectField<RegistrationFormValues> name="height" label="Height" required options={heights} />
          <SelectField<RegistrationFormValues>
            name="maritalStatus"
            label="Marital status"
            required
            options={maritalStatuses}
          />
          <SelectField<RegistrationFormValues>
            name="motherTongue"
            label="Mother tongue"
            required
            options={languages}
          />
        </div>
      </FieldGroup>

      <FieldGroup title="Religion & community">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <SelectField<RegistrationFormValues> name="religion" label="Religion" required options={religions} />
          <SelectField<RegistrationFormValues> name="caste" label="Caste" required options={castes} />
          <SelectField<RegistrationFormValues> name="subCaste" label="Sub caste" options={subCastes} />
        </div>
      </FieldGroup>

      <FieldGroup title="Location">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <TextField<RegistrationFormValues> name="country" label="Country" required />
          <SelectField<RegistrationFormValues> name="state" label="State" required options={states} />
          <SelectField<RegistrationFormValues> name="district" label="District" required options={districts} />
        </div>
      </FieldGroup>
    </div>
  );
}
