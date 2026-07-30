import type { RegistrationData } from "@/lib/registration/types";
import {
  ChipGroup,
  FieldGroup,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/registration/form-fields";

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

export function HoroscopeStep({
  data,
  update,
}: {
  data: RegistrationData;
  update: <K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) => void;
}) {
  return (
    <FieldGroup title="">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TextField
          label="Time of birth"
          type="time"
          value={data.birthTime}
          onChange={(v) => update("birthTime", v)}
        />
        <TextField
          label="Place of birth"
          value={data.birthPlace}
          onChange={(v) => update("birthPlace", v)}
          placeholder="Kochi, Kerala"
        />
        <SelectField
          label="Star (Nakshatra)"
          value={data.star || stars[0]}
          onChange={(v) => update("star", v)}
          options={stars}
        />
        <ChipGroup
          label="Dosham"
          value={data.dosham}
          onChange={(v) => update("dosham", v)}
          options={doshams}
          className="sm:col-span-2"
        />
        <TextareaField
          label="Additional horoscope notes"
          value={data.horoscopeNote}
          onChange={(v) => update("horoscopeNote", v)}
          placeholder="Anything else worth sharing for matching purposes…"
          className="sm:col-span-2"
        />
      </div>
    </FieldGroup>
  );
}
