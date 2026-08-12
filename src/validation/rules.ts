import { z } from "zod";

// Shared field-level validators — the single source of truth for what counts
// as a valid email/mobile/name/password across every client-side form
// (registration, login, contact), so the rules and their error messages
// can't drift out of sync between forms.

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_REGEX = /^\d{10}$/;
export const NAME_REGEX = /^[A-Za-z][A-Za-z '-]{1,49}$/;
export const MIN_PASSWORD_LENGTH = 8;

export const emailField = z.string().regex(EMAIL_REGEX, "Enter a valid email address");

export const mobileField = z.string().regex(MOBILE_REGEX, "Enter a valid 10-digit mobile number");

export const nameField = (label: string) =>
  z.string().regex(NAME_REGEX, `${label} must be at least 2 letters and contain no numbers or symbols`);

export const passwordField = (minLength: number = MIN_PASSWORD_LENGTH) =>
  z.string().min(minLength, `Password must be at least ${minLength} characters`);
