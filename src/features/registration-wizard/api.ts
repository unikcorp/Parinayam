import type { RegistrationFormValues } from "./schema";

/**
 * Mock submit — swap the body for a real POST to the Express API
 * (server/src/modules/member) once backend wiring lands.
 */
export async function submitRegistrationProfile(
  _data: RegistrationFormValues
): Promise<{ success: true }> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true };
}
