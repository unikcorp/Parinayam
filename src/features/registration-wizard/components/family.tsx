import {
  FieldGroup,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/forms/form-fields";
import type { RegistrationFormValues } from "../schema";

const familyTypes = ["Nuclear family", "Joint family"];
const familyValueOptions = ["Traditional", "Moderate", "Liberal"];

export function FamilyStep() {
  return (
    <FieldGroup title="">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SelectField<RegistrationFormValues> name="familyType" label="Family type" required options={familyTypes} />
        <SelectField<RegistrationFormValues>
          name="familyValues"
          label="Family values"
          required
          options={familyValueOptions}
        />
        <TextField<RegistrationFormValues> name="fatherOccupation" label="Father's occupation" />
        <TextField<RegistrationFormValues> name="motherOccupation" label="Mother's occupation" />
        <TextField<RegistrationFormValues>
          name="siblings"
          label="Siblings"
          placeholder="1 elder sister, married"
          className="sm:col-span-2"
        />
        <TextareaField<RegistrationFormValues>
          name="aboutFamily"
          label="About your family"
          placeholder="A few lines about your family background and values…"
          className="sm:col-span-2"
        />
      </div>
    </FieldGroup>
  );
}
