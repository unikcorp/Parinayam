"use client";

import { FieldGroup, TextareaField } from "@/components/forms/form-fields";
import type { RegistrationFormValues } from "../schema";

export function AboutStep() {
  return (
    <FieldGroup title="">
      <TextareaField<RegistrationFormValues>
        name="aboutMe"
        label="Tell us about yourself"
        placeholder="A few lines about you — this is what other members actually read when evaluating a match, more than any single field above."
        rows={7}
      />
    </FieldGroup>
  );
}
