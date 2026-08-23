import { FieldGroup, SelectField, TextField, TextareaField } from "@/components/forms/form-fields";
import { useFieldVisibility } from "@/hooks/use-field-visibility";
import type { RegistrationFormValues } from "../schema";
import type { RegistrationLookups } from "../use-registration-lookups";

export function HoroscopeStep({ lookups }: { lookups: RegistrationLookups }) {
  const { isFieldEnabled } = useFieldVisibility();

  return (
    <FieldGroup title="">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {isFieldEnabled("birthTime") && (
          <TextField<RegistrationFormValues> name="birthTime" label="Time of birth" type="time" />
        )}
        {isFieldEnabled("birthPlace") && (
          <TextField<RegistrationFormValues> name="birthPlace" label="Place of birth" placeholder="Kochi, Kerala" />
        )}
        {isFieldEnabled("star") && (
          <SelectField<RegistrationFormValues> name="star" label="Star (Nakshatra)" options={lookups.starOptions} />
        )}
        {isFieldEnabled("dosham") && (
          <SelectField<RegistrationFormValues> name="dosham" label="Dosham" options={lookups.doshOptions} />
        )}
        {isFieldEnabled("horoscopeNote") && (
          <TextareaField<RegistrationFormValues>
            name="horoscopeNote"
            label="Additional horoscope notes"
            placeholder="Anything else worth sharing for matching purposes…"
            className="sm:col-span-2"
          />
        )}
      </div>
    </FieldGroup>
  );
}
