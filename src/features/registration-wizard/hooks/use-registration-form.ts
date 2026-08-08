"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationSchema,
  registrationFieldsByStep,
  type RegistrationFormValues,
} from "../schema";
import { initialRegistrationData, registrationSteps } from "@/data/registration/types";
import {
  REGISTRATION_DRAFT_STORAGE_KEY as STORAGE_KEY,
  REGISTRATION_STEP_STORAGE_KEY as STEP_KEY,
} from "@/constants/storage-keys";

export function useRegistrationForm() {
  const [step, setStep] = useState(0);
  const hydrated = useRef(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: initialRegistrationData,
    mode: "onBlur",
  });

  const { watch, reset, trigger } = form;

  // Hydrate the saved draft after mount — localStorage isn't available on the server.
  useEffect(() => {
    try {
      const savedData = window.localStorage.getItem(STORAGE_KEY);
      const savedStep = window.localStorage.getItem(STEP_KEY);
      if (savedData) reset({ ...initialRegistrationData, ...JSON.parse(savedData) });
      if (savedStep) setStep(Number(savedStep));
    } catch {
      // ignore malformed drafts
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = watch((values) => {
      if (!hydrated.current) return;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(STEP_KEY, String(step));
  }, [step]);

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

  function clearDraft() {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STEP_KEY);
  }

  return { form, step, setStep, lastStep, goNext, goBack, clearDraft };
}
