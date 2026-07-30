import type { RegistrationData } from "@/lib/registration/types";
import {
  FieldGroup,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/registration/form-fields";

const familyTypes = ["Nuclear family", "Joint family"];
const familyValueOptions = ["Traditional", "Moderate", "Liberal"];

export function FamilyStep({
  data,
  update,
}: {
  data: RegistrationData;
  update: <K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) => void;
}) {
  return (
    <FieldGroup title="">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SelectField
          label="Family type"
          required
          value={data.familyType}
          onChange={(v) => update("familyType", v)}
          options={familyTypes}
        />
        <SelectField
          label="Family values"
          required
          value={data.familyValues}
          onChange={(v) => update("familyValues", v)}
          options={familyValueOptions}
        />
        <TextField
          label="Father's occupation"
          value={data.fatherOccupation}
          onChange={(v) => update("fatherOccupation", v)}
        />
        <TextField
          label="Mother's occupation"
          value={data.motherOccupation}
          onChange={(v) => update("motherOccupation", v)}
        />
        <TextField
          label="Siblings"
          value={data.siblings}
          onChange={(v) => update("siblings", v)}
          placeholder="1 elder sister, married"
          className="sm:col-span-2"
        />
        <TextareaField
          label="About your family"
          value={data.aboutFamily}
          onChange={(v) => update("aboutFamily", v)}
          placeholder="A few lines about your family background and values…"
          className="sm:col-span-2"
        />
      </div>
    </FieldGroup>
  );
}
