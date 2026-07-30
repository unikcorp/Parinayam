"use client";

import { useEffect, useRef, useState } from "react";
import { initialRegistrationData, type RegistrationData } from "./types";

const STORAGE_KEY = "parinayam:registration-draft";
const STEP_KEY = "parinayam:registration-step";

export function useRegistrationDraft() {
  const [data, setData] = useState<RegistrationData>(initialRegistrationData);
  const [step, setStep] = useState(0);
  const hydrated = useRef(false);

  // Hydrating client-only state from localStorage can only happen after mount
  // (the server has no access to it), so a one-time effect is the sanctioned
  // exception to the no-setState-in-effect rule here.
  useEffect(() => {
    try {
      const savedData = window.localStorage.getItem(STORAGE_KEY);
      const savedStep = window.localStorage.getItem(STEP_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedData) setData({ ...initialRegistrationData, ...JSON.parse(savedData) });
      if (savedStep) setStep(Number(savedStep));
    } catch {
      // ignore malformed drafts
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(STEP_KEY, String(step));
  }, [step]);

  function update<K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function clearDraft() {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STEP_KEY);
  }

  return { data, update, step, setStep, clearDraft };
}
