import {
  ChipGroup,
  FieldGroup,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/forms/form-fields";
import type { RegistrationFormValues } from "../schema";

const stars = [
  "Ashwathi",
  "Bharani",
  "Karthika",
  "Rohini",
  "Makayiram",
  "Thiruvathira",
  "Punartham",
  "Pooyam",
  "Ayilyam",
  "Makam",
  "Pooram",
  "Uthram",
  "Atham",
  "Chithira",
  "Chothi",
  "Vishakham",
  "Anizham",
  "Thrikketta",
  "Moolam",
  "Pooradam",
  "Uthradam",
  "Thiruvonam",
  "Avittam",
  "Chathayam",
  "Pooruruttathi",
  "Uthrattathi",
  "Revathi",
];
const doshams = ["No dosham", "Chevva dosham", "Not sure"];

export function HoroscopeStep() {
  return (
    <FieldGroup title="">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TextField<RegistrationFormValues> name="birthTime" label="Time of birth" type="time" />
        <TextField<RegistrationFormValues> name="birthPlace" label="Place of birth" placeholder="Kochi, Kerala" />
        <SelectField<RegistrationFormValues> name="star" label="Star (Nakshatra)" options={stars} />
        <ChipGroup<RegistrationFormValues> name="dosham" label="Dosham" options={doshams} className="sm:col-span-2" />
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
