import type { RegistrationData } from "@/lib/registration/types";
import {
  FieldGroup,
  SelectField,
  TextareaField,
} from "@/components/registration/form-fields";
import { RangeFilter } from "@/components/parinayam/range-filter";

const heights = ["4' 10\"", "5' 0\"", "5' 2\"", "5' 4\"", "5' 6\"", "5' 8\""];
const religions = ["Hindu", "Christian", "Muslim", "Any"];
const castes = ["Nair", "Ezhava", "Iyer", "Any"];
const educationLevels = ["Any education", "Graduate", "Postgraduate", "Doctorate"];

export function PreferencesStep({
  data,
  update,
}: {
  data: RegistrationData;
  update: <K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) => void;
}) {
  return (
    <FieldGroup title="">
      <div className="mb-6">
        <RangeFilter
          label="Partner age"
          value={[data.partnerAgeMin, data.partnerAgeMax]}
          onChange={([min, max]) => {
            update("partnerAgeMin", min);
            update("partnerAgeMax", max);
          }}
          min={21}
          max={55}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SelectField
          label="Minimum height"
          value={data.partnerHeightMin}
          onChange={(v) => update("partnerHeightMin", v)}
          options={heights}
        />
        <SelectField
          label="Religion"
          value={data.partnerReligion}
          onChange={(v) => update("partnerReligion", v)}
          options={religions}
        />
        <SelectField
          label="Caste"
          value={data.partnerCaste}
          onChange={(v) => update("partnerCaste", v)}
          options={castes}
        />
        <SelectField
          label="Education"
          value={data.partnerEducation}
          onChange={(v) => update("partnerEducation", v)}
          options={educationLevels}
        />
        <TextareaField
          label="What matters most to you"
          value={data.partnerAbout}
          onChange={(v) => update("partnerAbout", v)}
          placeholder="Describe the qualities and values you're looking for…"
          className="sm:col-span-2"
        />
      </div>
    </FieldGroup>
  );
}
