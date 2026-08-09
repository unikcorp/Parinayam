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

  async function goNext() {
    const fields = registrationFieldsByStep[step];
    const valid = fields.length === 0 ? true : await trigger(fields);
    if (!valid) return false;
    setStep((s) => Math.min(s + 1, registrationSteps.length - 1));
    return true;
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return { form, step, setStep, lastStep, goNext, goBack };
}
