"use client";

import { Controller, useFormContext } from "react-hook-form";
import { ChipGroup, Field, FieldGroup, PasswordField, SelectField, TextField } from "@/components/forms/form-fields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useBasicConfig } from "@/hooks/use-basic-config";
import type { RegistrationFormValues } from "../schema";
import type { RegistrationLookups } from "../use-registration-lookups";

const countryCodes = ["+91", "+1", "+44", "+61", "+971"];
const dobDays = Array.from({ length: 31 }, (_, i) => String(i + 1));
const dobMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_MALE_LEGAL_AGE = 21;
const DEFAULT_FEMALE_LEGAL_AGE = 18;
const maritalStatuses = ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"];

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

function DobField() {
  const { control, watch } = useFormContext<RegistrationFormValues>();
  const { data: basicConfig } = useBasicConfig();
  const gender = watch("gender");

  // Admin-configured (Site Settings > Update Basic Config) — the year list
  // only ever offers birth years that are both old enough (per the
  // gender-specific legal age) and no more recent than the admin's Last
  // Birth Year cap, whichever is stricter.
  const legalAge = gender === "male"
    ? (basicConfig?.maleLegalAge ?? DEFAULT_MALE_LEGAL_AGE)
    : (basicConfig?.femaleLegalAge ?? DEFAULT_FEMALE_LEGAL_AGE);
  const maxBirthYear = basicConfig
    ? Math.min(CURRENT_YEAR - legalAge, basicConfig.lastBirthYear)
    : CURRENT_YEAR - legalAge;
  const dobYears = Array.from({ length: 60 }, (_, i) => String(maxBirthYear - i));

  const parts = [
    { name: "dobDay" as const, placeholder: "Day", options: dobDays },
    { name: "dobMonth" as const, placeholder: "Month", options: dobMonths },
    { name: "dobYear" as const, placeholder: "Year", options: dobYears },
  ];
  return (
    <Field label="Date of birth" required>
      <div className="grid grid-cols-3 gap-2.5">
        {parts.map(({ name, placeholder, options }) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger className="h-auto w-full min-w-0 rounded-xl px-3 py-3.5 text-[15px] font-semibold">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        ))}
      </div>
    </Field>
  );
}

function MobileField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();
  const error = errors.mobileNumber?.message;

  return (
    <Field label="Mobile number" required error={error}>
      <div className="flex min-w-0 gap-2.5">
        <Controller
          name="mobileCountryCode"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-auto w-20 shrink-0 rounded-xl px-2.5 py-3.5 text-[15px] font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Controller
          name="mobileNumber"
          control={control}
          render={({ field }) => (
            <input
              type="tel"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              placeholder="98470 12345"
              className="h-auto min-w-0 flex-1 rounded-xl border border-input bg-transparent px-3 py-3.5 text-[15px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          )}
        />
      </div>
    </Field>
  );
}

export function AccountInfoStep({
  lookups,
  hideContactAndLogin,
}: {
  lookups: RegistrationLookups;
  // /profile/edit reuses this step for name/DOB/gender/religion, but mobile
  // number, email, and password change through OTP re-verification and
  // Settings → Security instead — not through this wizard.
  hideContactAndLogin?: boolean;
}) {
  return (
    <div className="flex flex-col gap-7">
      <FieldGroup title="">
        <ChipGroup<RegistrationFormValues>
          name="profileCreatedBy"
          label="Profile created by"
          required
          options={["Self", "Father", "Mother", "Brother", "Sister", "Relative", "Friend"]}
          className="mb-7"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField<RegistrationFormValues> name="firstName" label="First name" required placeholder="Anjali" />
          <TextField<RegistrationFormValues> name="lastName" label="Last name" required placeholder="Menon" />
          <GenderField />
          <DobField />
        </div>
      </FieldGroup>

      {!hideContactAndLogin && (
        <FieldGroup title="Contact & login">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-6">
            <MobileField />
            <TextField<RegistrationFormValues>
              name="email"
              label="Email"
              required
              type="email"
              placeholder="you@example.com"
            />
            <PasswordField<RegistrationFormValues>
              name="password"
              label="Password"
              required
              placeholder="At least 8 characters"
            />
            <PasswordField<RegistrationFormValues> name="confirmPassword" label="Confirm password" required />
          </div>
        </FieldGroup>
      )}

      <FieldGroup title="Religion & marital status">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SelectField<RegistrationFormValues>
            name="religion"
            label="Religion"
            required
            options={lookups.religionOptions}
          />
          <SelectField<RegistrationFormValues>
            name="maritalStatus"
            label="Marital status"
            required
            options={maritalStatuses}
          />
        </div>
      </FieldGroup>
    </div>
  );
}
