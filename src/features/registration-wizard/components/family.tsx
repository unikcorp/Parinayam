import {
  FieldGroup,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/forms/form-fields";
import { useFieldVisibility } from "@/hooks/use-field-visibility";
import type { RegistrationFormValues } from "../schema";

const familyTypes = ["Nuclear Family", "Joint Family"];
const familyValueOptions = ["Traditional", "Moderate", "Liberal"];

export function FamilyStep() {
  const { isFieldEnabled } = useFieldVisibility();

  return (
    <FieldGroup title="">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {isFieldEnabled("familyType") && (
          <SelectField<RegistrationFormValues> name="familyType" label="Family type" options={familyTypes} />
        )}
        {isFieldEnabled("familyValues") && (
          <SelectField<RegistrationFormValues>
            name="familyValues"
            label="Family values"
            options={familyValueOptions}
          />
        )}
        {isFieldEnabled("fatherOccupation") && (
          <TextField<RegistrationFormValues> name="fatherOccupation" label="Father's occupation" />
        )}
        {isFieldEnabled("motherOccupation") && (
          <TextField<RegistrationFormValues> name="motherOccupation" label="Mother's occupation" />
        )}
        {isFieldEnabled("siblings") && (
          <TextField<RegistrationFormValues>
            name="siblings"
            label="Siblings"
            placeholder="1 elder sister, married"
            className="sm:col-span-2"
          />
        )}
        {isFieldEnabled("aboutFamily") && (
          <TextareaField<RegistrationFormValues>
            name="aboutFamily"
            label="About your family"
            placeholder="A few lines about your family background and values…"
            className="sm:col-span-2"
          />
        )}
      </div>
    </FieldGroup>
  );
}
