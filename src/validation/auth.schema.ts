import { z } from "zod";
import { OTP_LENGTH } from "@/constants/auth";

export const loginSchema = z
  .object({
    mode: z.enum(["otp", "password"]),
    phone: z.string().min(10, "Enter a valid 10-digit mobile number"),
    otp: z.string(),
    password: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "otp" && data.otp.length < OTP_LENGTH) {
      ctx.addIssue({ code: "custom", message: `Enter the ${OTP_LENGTH}-digit OTP`, path: ["otp"] });
    }
    if (data.mode === "password" && data.password.length === 0) {
      ctx.addIssue({ code: "custom", message: "Password is required", path: ["password"] });
    }
  });

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginFormValues = {
  mode: "otp",
  phone: "98470 12345",
  otp: "472",
  password: "",
};
