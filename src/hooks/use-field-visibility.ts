import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Steps that can never be turned off — the wizard can't function without
// them (Account Info creates the account; Review is the submit step).
const ALWAYS_ENABLED_STEPS = new Set(["account", "review"]);

// Public — Site Settings > Enable/Disable Fields (admin) controls which
// fields/steps show up in the registration wizard. Fails open (nothing
// hidden) if the fetch hasn't resolved yet or errors, so the wizard is
// never blank or unexpectedly stuck.
export function useFieldVisibility() {
  const { data: fieldData } = useQuery({
    queryKey: ["disabled-registration-fields"],
    queryFn: () => api.get<{ fieldKeys: string[] }>("/api/site-settings/disabled-fields"),
    staleTime: 5 * 60 * 1000,
  });

  const { data: stepData } = useQuery({
    queryKey: ["disabled-registration-steps"],
    queryFn: () => api.get<{ stepKeys: string[] }>("/api/site-settings/disabled-steps"),
    staleTime: 5 * 60 * 1000,
  });

  const disabledFields = new Set(fieldData?.fieldKeys ?? []);
  const disabledSteps = new Set(stepData?.stepKeys ?? []);

  return {
    isFieldEnabled: (key: string) => !disabledFields.has(key),
    isStepEnabled: (stepKey: string) => ALWAYS_ENABLED_STEPS.has(stepKey) || !disabledSteps.has(stepKey),
    disabledSteps,
  };
}
