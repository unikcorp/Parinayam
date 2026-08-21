import { z } from "zod";
import { EMAIL_REGEX, MOBILE_REGEX, emailField, passwordField } from "@/validation/rules";

export const loginSchema = z
  .object({
    mode: z.enum(["otp", "password"]),
    phone: z.string(),
    email: z.string(),
    otp: z.string(),
    password: z.string(),
  })
  .superRefine((data, ctx) => {
    // Not checked against OTP_LENGTH — the digits aren't verified against a
    // real SMS code (no provider wired up), so any non-empty entry is fine.
    if (data.mode === "otp") {
      if (!MOBILE_REGEX.test(data.phone)) {
        ctx.addIssue({ code: "custom", message: "Enter a valid 10-digit mobile number", path: ["phone"] });
      }
      if (data.otp.length === 0) {
        ctx.addIssue({ code: "custom", message: "Enter the OTP", path: ["otp"] });
      }
    }
    if (data.mode === "password") {
      if (!EMAIL_REGEX.test(data.email)) {
        ctx.addIssue({ code: "custom", message: "Enter a valid email address", path: ["email"] });
      }
      if (data.password.length === 0) {
        ctx.addIssue({ code: "custom", message: "Password is required", path: ["password"] });
      }
    }
  });

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginFormValues = {
  mode: "password",
  phone: "",
  email: "",
  otp: "",
  password: "",
};

export const forgotPasswordSchema = z
  .object({
    email: emailField,
    otp: z.string(),
    newPassword: passwordField(8),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    // Not checked against a real code length — same dummy-OTP convention as
    // login, no SMS/email provider wired up yet.
    if (data.otp.length === 0) {
      ctx.addIssue({ code: "custom", message: "Enter the OTP", path: ["otp"] });
    }
    if (data.confirmPassword !== data.newPassword) {
      ctx.addIssue({ code: "custom", message: "Passwords do not match", path: ["confirmPassword"] });
    }
  });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordDefaultValues: ForgotPasswordFormValues = {
  email: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
};
