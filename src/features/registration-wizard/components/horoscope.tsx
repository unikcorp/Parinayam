import { FieldGroup, SelectField, TextField, TextareaField } from "@/components/forms/form-fields";
import type { RegistrationFormValues } from "../schema";
import type { RegistrationLookups } from "../use-registration-lookups";

export function HoroscopeStep({ lookups }: { lookups: RegistrationLookups }) {
  return (
    <FieldGroup title="">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TextField<RegistrationFormValues> name="birthTime" label="Time of birth" type="time" />
        <TextField<RegistrationFormValues> name="birthPlace" label="Place of birth" placeholder="Kochi, Kerala" />
        <SelectField<RegistrationFormValues> name="star" label="Star (Nakshatra)" options={lookups.starOptions} />
        <SelectField<RegistrationFormValues> name="dosham" label="Dosham" options={lookups.doshOptions} />
        <TextareaField<RegistrationFormValues>
          name="horoscopeNote"
          label="Additional horoscope notes"
          placeholder="Anything else worth sharing for matching purposes…"
          className="sm:col-span-2"
        />
      </div>
    </FieldGroup>
  );
}
