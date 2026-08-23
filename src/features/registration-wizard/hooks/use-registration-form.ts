"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationSchema,
  registrationFieldsByStep,
  type RegistrationFormValues,
} from "../schema";
import { initialRegistrationData, registrationSteps } from "@/data/registration/types";

export function useRegistrationForm() {
  const [step, setStep] = useState(0);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: initialRegistrationData,
    mode: "onBlur",
  });

  const { trigger } = form;

  const lastStep = step === registrationSteps.length - 1;

  // isStepEnabled lets a caller skip over admin-disabled steps (Site
  // Settings > Enable/Disable Fields) instead of landing on one that's been
  // turned off — optional so callers that don't care about that (e.g. a
  // caller with no such config) just get the plain +1/-1 behavior.
  async function goNext(isStepEnabled?: (index: number) => boolean) {
    const fields = registrationFieldsByStep[step];
    const valid = fields.length === 0 ? true : await trigger(fields);
    if (!valid) return false;
    setStep((s) => {
      let next = Math.min(s + 1, registrationSteps.length - 1);
      while (isStepEnabled && !isStepEnabled(next) && next < registrationSteps.length - 1) next++;
      return next;
    });
    return true;
  }

  function goBack(isStepEnabled?: (index: number) => boolean) {
    setStep((s) => {
      let prev = Math.max(s - 1, 0);
      while (isStepEnabled && !isStepEnabled(prev) && prev > 0) prev--;
      return prev;
    });
  }

  return { form, step, setStep, lastStep, goNext, goBack };
}
